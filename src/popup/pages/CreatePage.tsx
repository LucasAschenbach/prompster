import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EditPrompt from "../components/EditPrompt";
import { HiArrowLeft, HiPlus } from "react-icons/hi";
import { createPrompt } from "../../utils/message";
import { usePromptContext } from "../../contexts/PromptContext";

const CreatePage = () => {
  const { prompts } = usePromptContext();

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [text, setText] = useState("");

  const handleBack = () => {
    navigate(-1)
  };

  const handleCreate = () => {
    if (!keyword || !text) {
      return;
    }
    if (prompts[keyword]) {
      return;
    }
    createPrompt(keyword, text);
    handleBack();
  }

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  return (
    <div className="w-full">
      <div className="p-2 flex flex-row items-center justify-start border-b border-zinc-700">
        <button className="p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900" onClick={handleBack}><HiArrowLeft size={18}/></button>
        <h2 className="text-base text-white">Edit Prompt</h2>
      </div>
      <EditPrompt
        initialKeyword={""}
        initialText={""}
        onKeywordChange={handleKeywordChange}
        onTextChange={handleTextChange}
      />
      <div className="p-2 border-t border-zinc-700">
        <button
          className="w-full flex flex-row items-center justify-center space-x-4 p-2 rounded text-blue-500 hover:text-blue-400 hover:bg-zinc-900"
          onClick={handleCreate}
        >
          <HiPlus size={18} />
          Create Prompt
        </button>
      </div>
    </div>
  );
};

export default CreatePage;
