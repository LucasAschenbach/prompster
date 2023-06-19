import React, { useState, useEffect, useRef } from "react";
import {
  HiHashtag,
  HiMenuAlt2,
  HiOutlineInformationCircle,
} from "react-icons/hi";

interface EditPromptProps {
  initialKeyword: string;
  initialText: string;
  onKeywordChange: (newKeyword: string) => void;
  onTextChange: (newText: string) => void;
}

const EditPrompt: React.FC<EditPromptProps> = ({
  initialKeyword,
  initialText,
  onKeywordChange,
  onTextChange,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, []);

  const [keyword, setKeyword] = useState(initialKeyword);
  const [text, setText] = useState(initialText);

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    onKeywordChange(newKeyword);
    setKeyword(newKeyword);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    onTextChange(newText);
    setText(newText);
  };

  return (
    <>
      <form className="flex w-full flex-col">
        <label className="cursor-text">
          <div className="flex flex-row border-b border-zinc-700 px-2 py-4">
            <div className="px-4 py-2 text-white">
              <HiHashtag size={18} />
            </div>
            <div className="flex-grow px-2">
              <span className="block pb-2 text-xs text-zinc-500">Keyword</span>
              <input
                type="text"
                value={keyword}
                onChange={handleChangeKeyword}
                className="w-full border-none bg-transparent text-white outline-none"
              />
            </div>
          </div>
        </label>
        <label className="cursor-text">
          <div className="flex flex-row px-2 py-4">
            <div className="px-4 py-2 text-white">
              <HiMenuAlt2 size={18} />
            </div>
            <div className="flex-grow px-2">
              <span className="block pb-2 text-xs text-zinc-500">Prompt</span>
              <textarea
                id="prompt-text"
                ref={textareaRef}
                onInput={resizeTextarea}
                value={text}
                onChange={handleChangeText}
                className="h-auto w-full resize-none overflow-hidden border-none bg-transparent pb-4 text-white outline-none"
              />
              <span className="text-xs text-zinc-500">
                <HiOutlineInformationCircle
                  className="inline-block"
                  size={18}
                />{" "}
                Words enclosed by brackets [...] will be interpreted as
                variables.
              </span>
            </div>
          </div>
        </label>
      </form>
      <div className="h-2" />
    </>
  );
};

export default EditPrompt;
