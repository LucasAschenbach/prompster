import React, { useState, useEffect } from "react";
import SuggestionList from "./SuggestionList";
import Card from "./Card";

interface Props {
  prompts: Record<string, string>;
  onPromptInsert: (prompt: string) => void;
  position: "above" | "below";
}

const AutoComplete: React.FC<Props> = ({
  prompts,
  onPromptInsert,
  position,
}) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSuggestions = (newInput: string) => {
    setInput(newInput);
    if (newInput) {
      const filteredSuggestions = Object.keys(prompts)
        .filter((key) => key.toLowerCase().startsWith(newInput.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (position === "above") {
          setSelectedIndex((index) =>
            Math.min(suggestions.length - 1, index + 1)
          );
        } else {
          setSelectedIndex((index) => Math.max(0, index - 1));
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (position === "above") {
          setSelectedIndex((index) => Math.max(0, index - 1));
        } else {
          setSelectedIndex((index) =>
            Math.min(suggestions.length - 1, index + 1)
          );
        }
        break;
      case "Tab":
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selectedKey = suggestions[selectedIndex];
          onPromptInsert(prompts[selectedKey]);
        }
        break;
      case "Backspace":
        if (input.length === 0) {
          e.preventDefault();
          onPromptInsert("/");
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  const suggestionList = (
    <SuggestionList
      suggestions={suggestions}
      selectedIndex={selectedIndex}
      onSelect={updateSuggestions}
      position={position}
    />
  );

  return (
    <div
      className={`absolute flex w-64 flex-col space-y-2 text-sm ${
        position === "above" ? "-translate-y-full" : ""
      }`}
    >
      {position === "above" && suggestionList}
      <Card>
        <div className="flex flex-row items-center">
          <div className="font-lg flex w-4 justify-center font-bold">/</div>
          <input
            type="text"
            value={input}
            onChange={(e) => updateSuggestions(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            className="w-full bg-transparent outline-none ring-0"
          />
        </div>
      </Card>
      {position === "below" && suggestionList}
    </div>
  );
};

export default AutoComplete;
