import React from "react";
import { HiPlus } from "react-icons/hi";

interface Props {
  onSearch: (search: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex flex-row border-b border-zinc-700">
      <input
        className="flex-grow appearance-none bg-transparent px-4 py-4 text-white focus:outline-none"
        type="search"
        placeholder="Search prompts..."
        onChange={handleChange}
      />
      <button className="flex-none m-2 p-2 rounded text-blue-500 hover:bg-zinc-900 hover:text-blue-400">
        <HiPlus size={18} />
      </button>
    </div>
  );
};

export default SearchBar;
