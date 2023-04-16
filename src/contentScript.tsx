import React from "react";
import ReactDOM from "react-dom";
import AutoComplete from "./components/AutoComplete";
import "../styles/global.css";
import { PromptProvider } from "./contexts/PromptContext";

let autoCompleteOpen = false;

const handlePromptInsert = (
  inputField: HTMLInputElement | HTMLTextAreaElement,
  prompt: string
) => {
  const cursorPosition = inputField.selectionStart || 0;
  const currentValue = inputField.value;
  const newValue = currentValue.slice(0, cursorPosition) + prompt + currentValue.slice(cursorPosition);
  inputField.value = newValue;
  inputField.focus();
  inputField.setSelectionRange(
    cursorPosition + prompt.length,
    cursorPosition + prompt.length
  );
  const event = new Event("input", { bubbles: true });
  inputField.dispatchEvent(event);
};

const handleEscape = (
  e: KeyboardEvent,
  div: HTMLDivElement,
  inputField: HTMLInputElement | HTMLTextAreaElement
) => {
  if (e.key === "Escape") {
    handleCloseAutoComplete(div);
    inputField.focus();
  }
};

const handleCloseAutoComplete = (div: HTMLDivElement) => {
  if (div.parentElement) {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }
  autoCompleteOpen = false;
};

document.body.addEventListener("keydown", (e: KeyboardEvent) => {
  if (
    e.key === "/" &&
    !autoCompleteOpen &&
    (e.target instanceof HTMLInputElement ||
     e.target instanceof HTMLTextAreaElement)
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

    e.preventDefault();

    const escapeListener = (e: KeyboardEvent) => {
      handleEscape(e, div, inputField);
    };

    document.addEventListener("keydown", escapeListener);

    ReactDOM.render(
      <React.StrictMode>
        <div className="prompster">
          <PromptProvider>
            <AutoComplete
              onPromptInsert={(prompt) => {
                handlePromptInsert(inputField, prompt);
                handleCloseAutoComplete(div);
                document.removeEventListener("keydown", escapeListener);
              }}
              position={position}
            />
          </PromptProvider>
        </div>
      </React.StrictMode>,
      div
    );
  }
});
