import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { usePromptContext } from "../../contexts/PromptContext";
import { setPrompts } from "../../utils/message";
import { HiArrowLeft, HiUpload, HiDownload } from "react-icons/hi";

const DataPage: React.FC = () => {
  const { prompts } = usePromptContext();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    message: string;
    success: boolean;
  } | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(prompts, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prompts.json";
    link.click();
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    if (e.target) {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target) {
            try {
              const newPrompts = JSON.parse(e.target.result as string);
              setPrompts(newPrompts);
              setUploadStatus({ message: "Upload successful!", success: true });
            } catch (error) {
              setUploadStatus({
                message: "Invalid JSON. Upload failed!",
                success: false,
              });
            }
            setLoading(false);
          }
        };
        reader.readAsText(file);
      } else {
        setLoading(false);
        setUploadStatus({
          message: "No file selected. Upload failed!",
          success: false,
        });
      }
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUpload({
      target: { files: e.dataTransfer.files },
    } as ChangeEvent<HTMLInputElement>);
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
        <h2 className="text-base text-white">Edit Data File</h2>
      </div>
      <div className="flex flex-col space-y-2 p-2">
        <div className="p-2 text-zinc-500">
          You can download your prompts as a JSON file to edit them in a text
          editor of your choice and then upload them back to prompster.
        </div>
        <button
          className="flex w-full flex-row items-center justify-center space-x-4 rounded p-2 text-blue-500 hover:bg-zinc-900 hover:text-blue-400"
          onClick={handleDownload}
        >
          <HiDownload size={18} />
          Download Prompts
        </button>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded bg-zinc-900 p-4 text-blue-500 hover:text-blue-400"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            hidden
            onChange={handleUpload}
          />
          <div className="flex flex-row items-center justify-center space-x-4">
            <HiUpload size={18} />
            Upload Prompts
          </div>
          <div className="p-2 text-center text-zinc-500">
            Warning: Uploading a file will overwrite your current prompts.
          </div>
          {loading ? (
            <div className="p-2 text-zinc-500">
              {loading ? "Uploading..." : uploadStatus?.message}
            </div>
          ) : (
            <div
              className={`p-2 ${
                uploadStatus?.success ? "text-green-500" : "text-red-500"
              }`}
            >
              {uploadStatus?.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataPage;
