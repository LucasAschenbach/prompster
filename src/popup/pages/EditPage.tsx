import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditPrompt from "../components/EditPrompt";
import { usePromptContext } from "../../contexts/PromptContext";
import { deletePrompt, updatePrompt } from "../../utils/message";
import { HiArrowLeft, HiOutlineDuplicate, HiOutlineTrash } from "react-icons/hi";

const EditPage = () => {
  const { prompts } = usePromptContext();

  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();

  const [initialKeyword, initialText] = Object.entries(prompts)[parseInt(index ?? "0")];
  const [keyword, setKeyword] = useState(initialKeyword);
  const [text, setText] = useState(initialText);

  const handleBack = () => {
    navigate(-1)
  };

  const handleFork = async () => {
    // await createPrompt(keyword, text);
  };

  const handleDelete = async () => {
    await deletePrompt(keyword);
    handleBack();
  };

  const handleKeywordChange = (newKeyword: string) => {
    updatePrompt(keyword, newKeyword, text);
    setKeyword(newKeyword);
  };

  const handleTextChange = (newText: string) => {
    updatePrompt(keyword, keyword, newText);
    setText(newText);
  };

  return (
    <div className="w-full">
      <div className="p-2 flex flex-row items-center border-b border-zinc-700">
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={handleBack}><HiArrowLeft size={18}/></button>
        <h2 className="text-base text-white">Edit Prompt</h2>
        <div className="flex-grow" />
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={handleFork}><HiOutlineDuplicate size={18}/></button>
        <button className="p-2 rounded text-red-500 hover:text-red-400 hover:bg-zinc-900" onClick={handleDelete}><HiOutlineTrash size={18}/></button>
      </div>
      <EditPrompt
        initialKeyword={initialKeyword}
        initialText={initialText}
        onKeywordChange={handleKeywordChange}
        onTextChange={handleTextChange}
      />
    </div>
  );
};

export default EditPage;
