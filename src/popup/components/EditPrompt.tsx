import React, { useState, useEffect, useRef } from "react";
import { HiArrowLeft, HiOutlineDuplicate, HiOutlineTrash, HiOutlineHashtag, HiMenuAlt2, HiHashtag } from "react-icons/hi";

interface EditPromptProps {
  keyword: string;
  text: string;
  onSave: (newKeyword: string, newText: string) => void;
  onDelete: () => void;
  onBack: () => void;
}

const EditPrompt: React.FC<EditPromptProps> = ({
  keyword,
  text,
  onSave,
  onDelete,
  onBack,
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

  const [newKeyword, setNewKeyword] = useState(keyword);
  const [newText, setNewText] = useState(text);

  const handleSave = () => {
    onSave(newKeyword, newText);
  };

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeyword(e.target.value);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewText(e.target.value);
  };

  return (
    <div className="">
      <div className="p-2 flex flex-row items-center border-b border-zinc-700">
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={onBack}><HiArrowLeft size={18}/></button>
        <h2 className="text-base text-white">Edit Prompt</h2>
        <div className="flex-grow" />
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={handleSave}><HiOutlineDuplicate size={18}/></button>
        <button className="p-2 rounded text-red-500 hover:text-red-400 hover:bg-zinc-900" onClick={onDelete}><HiOutlineTrash size={18}/></button>
      </div>
      <form className="flex flex-col w-full">
        <label>
          <div className="px-2 py-4 flex flex-row border-b border-zinc-700">
            <div className="px-4 py-2 text-white"><HiHashtag size={18}/></div>
            <div className="px-2 flex-grow">
              <span className="pb-2 block text-xs text-zinc-500">Keyword</span>
              <input
                type="text"
                value={newKeyword}
                onChange={handleChangeKeyword}
                className="w-full text-white bg-transparent border-none outline-none"
              />
            </div>
          </div>
        </label>
        <label>
          <div className="px-2 py-4 flex flex-row">
            <div className="px-4 py-2 text-white"><HiMenuAlt2 size={18}/></div>
            <div className="px-2 flex-grow">
              <span className="pb-2 block text-xs text-zinc-500">Prompt</span>
              <textarea
                id="prompt-text"
                ref={textareaRef}
                onInput={resizeTextarea}
                value={newText}
                onChange={handleChangeText}
                className="w-full h-auto overflow-hidden text-white bg-transparent border-none outline-none resize-none"
              />
            </div>
          </div>
        </label>
      </form>
      <button onClick={handleSave}>Save</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default EditPrompt;
