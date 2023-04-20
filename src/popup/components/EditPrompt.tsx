import React, { useState, useEffect, useRef } from "react";
import { HiHashtag, HiMenuAlt2 } from "react-icons/hi";

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
    textareaRef.current.style.height = 'auto';
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
      <form className="flex flex-col w-full">
        <label className="cursor-text">
          <div className="px-2 py-4 flex flex-row border-b border-zinc-700">
            <div className="px-4 py-2 text-white"><HiHashtag size={18}/></div>
            <div className="px-2 flex-grow">
              <span className="pb-2 block text-xs text-zinc-500">Keyword</span>
              <input
                type="text"
                value={keyword}
                onChange={handleChangeKeyword}
                className="w-full text-white bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </label>
        <label className="cursor-text">
          <div className="px-2 py-4 flex flex-row">
            <div className="px-4 py-2 text-white"><HiMenuAlt2 size={18}/></div>
            <div className="px-2 flex-grow">
              <span className="pb-2 block text-xs text-zinc-500">Prompt</span>
              <textarea
                id="prompt-text"
                ref={textareaRef}
                onInput={resizeTextarea}
                value={text}
                onChange={handleChangeText}
                className="w-full h-auto overflow-hidden text-white bg-transparent border-none outline-none resize-none"
              />
            </div>
          </div>
        </label>
      </form>
      <div className="h-2" />
    </>
  );
};

export default EditPrompt;
