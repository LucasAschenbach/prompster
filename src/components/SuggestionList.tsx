import React from "react";
import Card from "./Card";
import { HiArrowNarrowRight } from "react-icons/hi";

interface Props {
  suggestions: string[];
  selectedIndex: number;
  onClick: (suggestion: string) => void;
  position: "above" | "below";
}

const SuggestionList: React.FC<Props> = ({
  suggestions,
  selectedIndex,
  onClick,
  position,
}) => {
  const displaySuggestions =
    position === "above" ? [...suggestions].reverse() : suggestions;
  const displayIndex =
    position === "above"
      ? suggestions.length - 1 - selectedIndex
      : selectedIndex;

  return (
    <div
      className={`w-full
      ${suggestions.length > 0 ? "" : "hidden"}`}
    >
      <Card>
        <ul className="p-2">
          {displaySuggestions.map((suggestion, index) => {
            const selected = index === displayIndex;
            return (
              <li
                key={suggestion}
                onClick={() => onClick(suggestion)}
                className={`cursor-pointer rounded-sm px-2 py-1 ${
                  selected
                    ? "bg-blue-700 hover:bg-blue-600"
                    : "hover:bg-zinc-900"
                }`}
              >
                <div className="flex flex-row items-center justify-between space-x-2">
                  {suggestion}
                  {selected ? <HiArrowNarrowRight /> : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default SuggestionList;
