import React from "react";
import { HiPlus, HiOutlineDocumentText } from "react-icons/hi";

interface Props {
  onSearch: (search: string) => void;
  onData: () => void;
  onAdd: () => void;
}

const SearchBar: React.FC<Props> = ({ onSearch, onData, onAdd }) => {
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
      <div className="flex flex-row p-2">
        <button
          className="flex-none rounded p-2 text-blue-500 hover:bg-zinc-900 hover:text-blue-400"
          onClick={onData}
        >
          <HiOutlineDocumentText size={18} />
        </button>
        <button
          className="flex-none rounded p-2 text-blue-500 hover:bg-zinc-900 hover:text-blue-400"
          onClick={onAdd}
        >
          <HiPlus size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
