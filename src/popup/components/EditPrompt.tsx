import React, { useState, useEffect, useRef } from "react";
import { HiArrowLeft, HiOutlineDuplicate, HiOutlineTrash, HiMenuAlt2, HiHashtag } from "react-icons/hi";
import { addPrompt, deletePrompt, updatePrompt } from "../../utils/message";

interface EditPromptProps {
  keyword: string;
  text: string;
  onBack: () => void;
}

const EditPrompt: React.FC<EditPromptProps> = ({
  keyword,
  text,
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

  const handleFork = async () => {
    await addPrompt(keyword, text);
  };

  const handleDelete = async () => {
    await deletePrompt(keyword);
    onBack();
  };

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = e.target.value;
    updatePrompt(keyword, newKeyword, newText);
    setNewKeyword(newKeyword);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    updatePrompt(keyword, newKeyword, newText);
    setNewText(newText);
  };

  return (
    <div className="">
      <div className="p-2 flex flex-row items-center border-b border-zinc-700">
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={onBack}><HiArrowLeft size={18}/></button>
        <h2 className="text-base text-white">Edit Prompt</h2>
        <div className="flex-grow" />
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={handleFork}><HiOutlineDuplicate size={18}/></button>
        <button className="p-2 rounded text-red-500 hover:text-red-400 hover:bg-zinc-900" onClick={handleDelete}><HiOutlineTrash size={18}/></button>
      </div>
      <form className="flex flex-col w-full">
        <label className="cursor-text">
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
        <label className="cursor-text">
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
      <div className="h-2" />
    </div>
  );
};

export default EditPrompt;
