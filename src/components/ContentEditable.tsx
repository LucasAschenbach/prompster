import React, { useState, useEffect, useRef, forwardRef } from "react";

interface Props extends Omit<React.HTMLProps<HTMLDivElement>, "onChange" | "contentEditable" | "suppressContentEditableWarning" | "onInput"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderColor?: string;
}

const ContentEditable = forwardRef<HTMLDivElement,Props>(({
  value,
  onChange,
  placeholder,
  placeholderColor,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof ref === "function") {
      ref(divRef.current);
    } else if (ref) {
      ref.current = divRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (isEditing && divRef.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(divRef.current.childNodes[0] ?? divRef.current, cursorPosition);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
      divRef.current.focus();
    }
  }, [isEditing, cursorPosition]);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onBlur?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(true);
    onFocus?.(event);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent ?? "";
    onChange(newValue);
    setCursorPosition(getCursorPosition());
  };

  const getCursorPosition = () => {
    const sel = window.getSelection();
    if (sel?.rangeCount && divRef.current) {
      const range = sel.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(divRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  };

  return (
    <>
      <style>
        {`
          [contenteditable="true"]:empty:before {
            content: attr(data-placeholder);
            color: var(--placeholder-color, #aaa);
          }
        `}
      </style>
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onFocus={handleFocus}
        onInput={handleInput}
        data-placeholder={placeholder}
        style={
          { "--placeholder-color": placeholderColor } as React.CSSProperties
        }
        {...props}
      >
        {value}
      </div>
    </>
  );
});

export default ContentEditable;
