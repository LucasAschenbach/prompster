import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditPrompt from "../components/EditPrompt";

import promptsData from "../../../static/prompts.json";

const EditPage = () => {
  const navigate = useNavigate();
  const { index } = useParams<{ index: string }>();

  const [keyword, text] = Object.entries(promptsData)[parseInt(index ?? "0")];

  const handleSave = (keyword: string, text: string) => {
    // TODO: Save to storage
  };

  const handleDeletePrompt = () => {
    // TODO: Delete from storage
  };

  const handleBack = () => {
    navigate(-1)
  };

  return (
    <div className="w-full">
      <EditPrompt
        keyword={keyword}
        text={text}
        onSave={handleSave}
        onDelete={handleDeletePrompt}
        onBack={handleBack}
      />
    </div>
  );
};

export default EditPage;
