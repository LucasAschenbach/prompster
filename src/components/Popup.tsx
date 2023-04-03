import React from "react";
import Card from "./Card";

const Popup: React.FC = () => {
  const openGitHubPage = () => {
    chrome.tabs.create({
      url: "https://github.com/lucasaschenbach/prompster",
    });
  };
  const openChatGPTPage = () => {
    chrome.tabs.create({
      url: "https://chat.openai.com/chat",
    });
  };

  return (
    <div className="w-64 border border-zinc-700 bg-black p-2">
      <div className="px-2">
        <h1 className="mb-1 text-xl font-bold text-white">prompster</h1>
        <p className="text-zinc-300">Slash Commands for ChatGPT</p>
      </div>
      <div className="h-6" />
      <div className="flex flex-row space-x-2">
        <button
          className="flex-1 rounded bg-zinc-700 px-2 py-2 text-blue-400 hover:bg-zinc-600 hover:text-blue-300"
          onClick={openGitHubPage}
        >
          About
        </button>
        <button
          className="flex-1 rounded bg-blue-700 px-2 py-2 text-white hover:bg-blue-600"
          onClick={openChatGPTPage}
        >
          ChatGPT
        </button>
      </div>
    </div>
  );
};

export default Popup;
