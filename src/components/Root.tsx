import React, { useEffect } from "react";
import { SettingsProvider, useSettingsContext } from "../contexts/SettingsContext";
import { PromptProvider } from "../contexts/PromptContext";
import AutoComplete from "./AutoComplete";
import ReactDOM from "react-dom";
import launchDialog from "../utils/DialogManager";

const Root: React.FC = () => {
  const { settings } = useSettingsContext();

  let autoCompleteOpen = false;

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
    inputField: HTMLInputElement | HTMLTextAreaElement,
    promptKey: string,
    prompt: string
  ) => {
    // process special variables
    const processedPrompt = await replaceVariables(prompt);

    // check for regular variables
    const containsVariables = /\[[^\]]+\]/.test(processedPrompt);
    if (containsVariables) {
      launchDialog(
        promptKey,
        processedPrompt,
        (result: string) => {
          handlePromptInsert(inputField, result);
        },
        () => {
          inputField.focus();
        }
      );
    } else {
      handlePromptInsert(inputField, processedPrompt);
    }
  };

  const handlePromptInsert = (
    inputField: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
    prompt: string
  ) => {
    if (
      inputField instanceof HTMLInputElement ||
      inputField instanceof HTMLTextAreaElement
    ) {
      // For a regular input or textarea
      const cursorPosition = inputField.selectionStart ?? 0;
      const currentValue = inputField.value;
      const newValue =
        currentValue.slice(0, cursorPosition) +
        prompt +
        currentValue.slice(cursorPosition);
      inputField.value = newValue;
      inputField.focus();
      inputField.setSelectionRange(
        cursorPosition + prompt.length,
        cursorPosition + prompt.length
      );
      const event = new Event("input", { bubbles: true });
      inputField.dispatchEvent(event);
    } else if (inputField.getAttribute("contenteditable") === "true") {
      // For a contenteditable element
      inputField.focus();
      let sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel?.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(prompt));
          range.collapse(false);
        }
      } else if (
        (document as any).selection &&
        (document as any).selection.createRange
      ) {
        (document as any).selection.createRange().text = prompt;
      }
      const event = new Event("input", { bubbles: true });
      inputField.dispatchEvent(event);
    }
  };

  const handleEscape = (
    e: KeyboardEvent,
    div: HTMLDivElement,
    inputField: HTMLInputElement | HTMLTextAreaElement | HTMLElement
  ) => {
    if (e.key === "Escape") {
      handleCloseAutoComplete(inputField, div);
      inputField.focus();
    }
  };

  const handleCloseAutoComplete = (
    inputField: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
    div: HTMLDivElement
  ) => {
    if (div.parentElement) {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      // inputField.parentElement?.removeChild(div);
    }
    autoCompleteOpen = false;
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
      !autoCompleteOpen &&
      (e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement &&
          e.target.getAttribute("contenteditable") === "true"))
    ) {
      autoCompleteOpen = true;
      const inputField = e.target as HTMLInputElement | HTMLTextAreaElement;
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
        handleEscape(e, div, inputField);
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
