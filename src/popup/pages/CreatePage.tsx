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
    navigate(-1);
  };

  const handleCreate = () => {
    if (!keyword || !text) {
      // values must be non-empty
      return;
    }
    if (prompts[keyword]) {
      // keyword must be unique
      return;
    }
    createPrompt(keyword, text);
    handleBack();
  };

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
  };

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-start border-b border-zinc-700 p-2">
        <button
          className="rounded p-2 text-blue-500 hover:bg-zinc-900 hover:text-blue-400"
          onClick={handleBack}
        >
          <HiArrowLeft size={18} />
        </button>
        <h2 className="text-base text-white">Create Prompt</h2>
      </div>
      <EditPrompt
        initialKeyword={""}
        initialText={""}
        onKeywordChange={handleKeywordChange}
        onTextChange={handleTextChange}
      />
      <div className="border-t border-zinc-700 p-2">
        <button
          className="flex w-full flex-row items-center justify-center space-x-4 rounded p-2 text-blue-500 hover:bg-zinc-900 hover:text-blue-400"
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
