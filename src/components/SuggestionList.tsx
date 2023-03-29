import React from "react";
import Card from "./Card";

interface Props {
  suggestions: string[];
  selectedIndex: number;
  onSelect: (suggestion: string) => void;
  position: "above" | "below";
}

const SuggestionList: React.FC<Props> = ({ suggestions, selectedIndex, onSelect, position }) => {
  const displaySuggestions = position === "above" ? [...suggestions].reverse() : suggestions;
  const displayIndex = position === "above" ? suggestions.length - 1 - selectedIndex : selectedIndex;

  return (
    <div className={
      `w-full
      ${position === "above" ? "bottom-full" : "top-full"}
      ${suggestions.length > 0 ? "" : "hidden"}`
    }>
      <Card>
        <ul>
          {displaySuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => onSelect(suggestion)}
              className={`px-2 py-1 cursor-pointer rounded-sm ${
                index === displayIndex ? "bg-zinc-700" : ""
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default SuggestionList;
