import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditPrompt from "../components/EditPrompt";
import { usePromptContext } from "../../contexts/PromptContext";

const EditPage = () => {
  const { prompts } = usePromptContext();

  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();

  const [keyword, text] = Object.entries(prompts)[parseInt(index ?? "0")];

  const handleBack = () => {
    navigate(-1)
  };

  return (
    <div className="w-full">
      <EditPrompt
        keyword={keyword}
        text={text}
        onBack={handleBack}
      />
    </div>
  );
};

export default EditPage;
