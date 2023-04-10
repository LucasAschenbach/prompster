import React from "react";
import { HiArrowNarrowRight, HiX } from "react-icons/hi";

interface DeleteButtonProps {
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onDelete }) => {
  return (
    <button
      className="hidden rounded bg-red-950 p-2 text-red-500 hover:bg-red-900 hover:text-red-400 group-hover:block"
      onClick={onDelete}
    >
      <HiX />
    </button>
  );
};

interface SearchResultProps {
  keyword: string;
  text: string;
  onClick: () => void;
}

const SearchResult: React.FC<SearchResultProps> = ({
  keyword,
  text,
  onClick,
}) => {
  return (
    <div
      className="group relative flex-grow rounded border-zinc-700 p-2 hover:bg-zinc-900 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-row">
        <h3 className="pb-1 font-bold text-white">{keyword}</h3>
        <div className="flex-grow" />
        <HiArrowNarrowRight className="hidden text-white group-hover:block" />
      </div>
      <p className="line-clamp-3 text-zinc-500">{text}</p>
    </div>
  );
};

export default SearchResult;
