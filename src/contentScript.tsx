import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import AutoComplete from './components/AutoComplete';
import prompts from '../static/prompts.json';

let autoCompleteOpen = false;

const handlePromptInsert = (
  inputField: HTMLInputElement | HTMLTextAreaElement,
  prompt: string
) => {
  const cursorPosition = inputField.selectionStart || 0;
  const currentValue = inputField.value;
  inputField.value = currentValue.slice(0, cursorPosition - 1) + prompt
  inputField.focus();
  inputField.setSelectionRange(
    cursorPosition + prompt.length,
    cursorPosition + prompt.length
  );
  const event = new Event('input', { bubbles: true });
  inputField.dispatchEvent(event);
};

const getCaretCoordinates = (
  inputField: HTMLInputElement | HTMLTextAreaElement
) => {
  // const range = document.createRange();
  // const selection = window.getSelection();

  // const textNode =
  //   inputField instanceof HTMLTextAreaElement
  //     ? inputField.childNodes[0] || inputField
  //     : inputField;

  // range.setStart(textNode, inputField.selectionStart || 0);
  // range.setEnd(textNode, inputField.selectionEnd || 0);

  // const rect = range.getBoundingClientRect();
  // const inputRect = inputField.getBoundingClientRect();

  // return {
  //   left: rect.left - inputRect.left,
  //   top: rect.top - inputRect.top,
  // };

  return {
    left: 0,
    top: 0,
  }
};

const handleEscape = (
  e: KeyboardEvent,
  div: HTMLDivElement,
  inputField: HTMLInputElement | HTMLTextAreaElement
) => {
  if (e.key === 'Escape') {
    handleCloseAutoComplete(div);
    inputField.focus();
  }
};

const handleCloseAutoComplete = (
  div: HTMLDivElement,
) => {
  if (div.parentElement) {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  }
  autoCompleteOpen = false;
};

document.body.addEventListener('keydown', (e: KeyboardEvent) => {
  if (
    e.key === '/' &&
    !autoCompleteOpen &&
    (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
  ) {
    autoCompleteOpen = true;
    const inputField = e.target as HTMLInputElement | HTMLTextAreaElement;
    const rect = inputField.getBoundingClientRect();
    const caretCoordinates = getCaretCoordinates(inputField);

    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = `${rect.left + caretCoordinates.left + window.scrollX}px`;
    div.style.top = `${rect.top - rect.height + 30 + caretCoordinates.top + window.scrollY}px`;
    div.style.zIndex = '1000';
    document.body.appendChild(div);

    ReactDOM.render(
      <React.StrictMode>
        <AutoComplete
          prompts={prompts}
          onPromptInsert={(prompt) => {
            handlePromptInsert(inputField, prompt);
            handleCloseAutoComplete(div);
          }}
        />
      </React.StrictMode>,
      div,
    );

    e.preventDefault();

    const escapeListener = (e: KeyboardEvent) => {
      handleEscape(e, div, inputField);
    };

    document.addEventListener('keydown', escapeListener);

    ReactDOM.render(
      <React.StrictMode>
        <AutoComplete
          prompts={prompts}
          onPromptInsert={(prompt) => {
            handlePromptInsert(inputField, prompt);
            handleCloseAutoComplete(div);
            document.removeEventListener('keydown', escapeListener);
          }}
        />
      </React.StrictMode>,
      div,
    );
  }
});
