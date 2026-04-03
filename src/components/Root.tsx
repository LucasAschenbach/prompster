import React, { useEffect, useRef } from "react";
import { SettingsProvider, useSettingsContext } from "../contexts/SettingsContext";
import { PromptProvider } from "../contexts/PromptContext";
import AutoComplete from "./AutoComplete";
import ReactDOM from "react-dom";
import launchDialog from "../utils/DialogManager";


type TargetField = HTMLInputElement | HTMLTextAreaElement | HTMLElement;

type SelectionSnapshot =
  | { kind: "text"; start: number; end: number }
  | { kind: "range"; range: Range };

const Root: React.FC = () => {
  const { settings } = useSettingsContext();

  const autoCompleteOpenRef = useRef(false);
  const activeTargetRef = useRef<TargetField | null>(null);
  const selectionSnapshotRef = useRef<SelectionSnapshot | null>(null);

  const isTextInput = (
    inputField: TargetField
  ): inputField is HTMLInputElement | HTMLTextAreaElement =>
    inputField instanceof HTMLInputElement ||
    inputField instanceof HTMLTextAreaElement;

  const captureSelectionSnapshot = (
    inputField: TargetField
  ): SelectionSnapshot | null => {
    if (isTextInput(inputField)) {
      return {
        kind: "text",
        start: inputField.selectionStart ?? 0,
        end: inputField.selectionEnd ?? inputField.selectionStart ?? 0,
      };
    }

    if (inputField.getAttribute("contenteditable") === "true") {
      const selection = window.getSelection();
      if (!selection?.rangeCount) {
        return null;
      }

      const range = selection.getRangeAt(0);
      if (!inputField.contains(range.commonAncestorContainer)) {
        return null;
      }

      return { kind: "range", range: range.cloneRange() };
    }

    return null;
  };

  const restoreSelectionSnapshot = (
    inputField: TargetField,
    snapshot = selectionSnapshotRef.current
  ) => {
    if (!snapshot) {
      inputField.focus();
      return;
    }

    if (isTextInput(inputField) && snapshot.kind === "text") {
      inputField.focus();
      inputField.setSelectionRange(snapshot.start, snapshot.end);
      return;
    }

    if (
      inputField.getAttribute("contenteditable") === "true" &&
      snapshot.kind === "range"
    ) {
      inputField.focus();
      const selection = window.getSelection();
      if (!selection) {
        return;
      }

      try {
        selection.removeAllRanges();
        selection.addRange(snapshot.range.cloneRange());
      } catch (error) {
        console.error("Failed to restore contenteditable selection:", error);
      }
    }
  };

  const clearSavedSelection = () => {
    activeTargetRef.current = null;
    selectionSnapshotRef.current = null;
  };

  const replaceVariables = async (prompt: string) => {
    // Define variables
    const variables: { [key: string]: () => Promise<string> } = {
      "\\[paste\\]": async () => {
        try {
          return await navigator.clipboard.readText();
        } catch (err) {
          console.error("Failed to read clipboard contents: ", err);
          return "[paste]"; // Fallback to the original text if the clipboard can't be read
        }
      },
      "\\[paste-clean\\]": async () => {
        try {
          const clipboard = await navigator.clipboard.readText();
          return clipboard.replace(/[\r\n]+/g, " ");
        } catch (err) {
          console.error("Failed to read clipboard contents: ", err);
          return "[paste-clean]"; // Fallback to the original text if the clipboard can't be read
        }
      },
      "\\[date\\]": async () => {
        const date = new Date();
        return date.toLocaleDateString();
      },
      // Add more variables here
    };

    // Iterate over variables and replace
    for (const pattern in variables) {
      // run logic for variable
      const replacement = await variables[pattern]();
      prompt = prompt.replace(new RegExp(pattern, "g"), replacement);
    }

    return prompt;
  };

  const handlePromptSelect = async (
    inputField: TargetField,
    promptKey: string,
    prompt: string
  ) => {
    const targetField = activeTargetRef.current ?? inputField;

    // process special variables
    const processedPrompt = await replaceVariables(prompt);

    // check for regular variables
    const containsVariables = /\[[^\]]+\]/.test(processedPrompt);
    if (containsVariables) {
      launchDialog(
        promptKey,
        processedPrompt,
        (result: string) => {
          handlePromptInsert(targetField, result);
        },
        () => {
          restoreSelectionSnapshot(targetField);
          clearSavedSelection();
        }
      );
    } else {
      handlePromptInsert(targetField, processedPrompt);
    }
  };

  const handlePromptInsert = (
    inputField: TargetField,
    prompt: string
  ) => {
    const snapshot =
      selectionSnapshotRef.current ?? captureSelectionSnapshot(inputField);

    if (isTextInput(inputField)) {
      // For a regular input or textarea
      const start =
        snapshot?.kind === "text" ? snapshot.start : inputField.selectionStart ?? 0;
      const end =
        snapshot?.kind === "text" ? snapshot.end : inputField.selectionEnd ?? start;
      const currentValue = inputField.value;
      const newValue =
        currentValue.slice(0, start) +
        prompt +
        currentValue.slice(end);
      inputField.value = newValue;
      inputField.focus();
      inputField.setSelectionRange(
        start + prompt.length,
        start + prompt.length
      );
      const event = new Event("input", { bubbles: true });
      inputField.dispatchEvent(event);
    } else if (inputField.getAttribute("contenteditable") === "true") {
      // For a contenteditable element
      restoreSelectionSnapshot(inputField, snapshot);
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range =
          snapshot?.kind === "range"
            ? snapshot.range.cloneRange()
            : selection.getRangeAt(0).cloneRange();
        const promptNode = document.createTextNode(prompt);
        range.deleteContents();
        range.insertNode(promptNode);

        const nextRange = document.createRange();
        nextRange.setStartAfter(promptNode);
        nextRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(nextRange);
      } else if (
        (document as any).selection &&
        (document as any).selection.createRange
      ) {
        (document as any).selection.createRange().text = prompt;
      }
      const event = new Event("input", { bubbles: true });
      inputField.dispatchEvent(event);
    }

    clearSavedSelection();
  };

  const handleEscape = (
    e: KeyboardEvent,
    div: HTMLDivElement,
    inputField: TargetField,
    escapeListener: (event: KeyboardEvent) => void
  ) => {
    if (e.key === "Escape") {
      handleCloseAutoComplete(activeTargetRef.current ?? inputField, div, {
        restoreSelection: true,
      });
      document.removeEventListener("keydown", escapeListener);
    }
  };

  const handleCloseAutoComplete = (
    inputField: TargetField,
    div: HTMLDivElement,
    options: { restoreSelection?: boolean } = {}
  ) => {
    if (div.parentElement) {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      // inputField.parentElement?.removeChild(div);
    }
    autoCompleteOpenRef.current = false;

    if (options.restoreSelection) {
      restoreSelectionSnapshot(inputField);
      clearSavedSelection();
    }
  };

  const handleTrigger = (e: KeyboardEvent) => {
    if (settings.onlyFirstChar) {
      // Only trigger if cursor is at the beginning of the input
      if (
        (e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement) &&
        e.target.selectionStart !== 0
      ) {
        return;
      } else if (
        e.target instanceof HTMLElement &&
        e.target.getAttribute("contenteditable") === "true" &&
        window.getSelection()?.anchorOffset !== 0
      ) {
        return;
      }
    }

    // Trigger on "/" for input, textarea, and contenteditable
    if (
      e.key === "/" &&
      !autoCompleteOpenRef.current &&
      (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement &&
          e.target.getAttribute("contenteditable") === "true"))
    ) {

      const inputField = e.target as TargetField;
      const snapshot = captureSelectionSnapshot(inputField);
      activeTargetRef.current = inputField;
      selectionSnapshotRef.current = snapshot;
      autoCompleteOpenRef.current = true;
      const rect = inputField.getBoundingClientRect();

      const position = rect.top < window.innerHeight / 2 ? "below" : "above";

      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = `${rect.left + window.scrollX}px`;
      div.style.zIndex = "1000";

      if (position === "above") {
        div.style.bottom = `${
          window.innerHeight - rect.bottom + window.scrollY
        }px`;
      } else {
        div.style.top = `${rect.top + window.scrollY}px`;
      }

      document.body.appendChild(div);
      // inputField.parentElement?.insertBefore(div, inputField.nextSibling);

      e.preventDefault();

      const escapeListener = (e: KeyboardEvent) => {
        handleEscape(e, div, inputField, escapeListener);
      };

      document.addEventListener("keydown", escapeListener);

      ReactDOM.render(
        <React.StrictMode>
          <div className="prompster">
            <div className="font-sans">
              <SettingsProvider>
                <PromptProvider>
                  <AutoComplete
                    onPromptSelect={(promptKey, prompt) => {
                      handlePromptSelect(inputField, promptKey, prompt);
                      handleCloseAutoComplete(inputField, div);
                      document.removeEventListener("keydown", escapeListener);
                    }}
                    position={position}
                  />
                </PromptProvider>
              </SettingsProvider>
            </div>
          </div>
        </React.StrictMode>,
        div
      );
    }
  };
  
  // Event listener must be renewed on every settings change to avoid stale closures
  useEffect(() => {
    document.body.addEventListener("keydown", handleTrigger);

    return () => {
      document.body.removeEventListener("keydown", handleTrigger);
    };
  }, [settings]);

  return null;
};

export default Root;
