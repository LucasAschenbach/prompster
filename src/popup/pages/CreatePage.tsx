import React from "react";
import { useNavigate } from "react-router-dom";
import EditPrompt from "../components/EditPrompt";

const CreatePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1)
  };

  return (
    <div className="w-full">
      <EditPrompt
        keyword={""}
        text={""}
        onBack={handleBack}
      />
    </div>
  );
};

export default CreatePage;
