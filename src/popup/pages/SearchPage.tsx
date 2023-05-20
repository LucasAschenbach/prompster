import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import { usePromptContext } from "../../contexts/PromptContext";

const SearchPage = () => {
  const { prompts } = usePromptContext();

  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchBarPlaceholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchBarRef.current && searchBarPlaceholderRef.current) {
      const heigth = searchBarRef.current.getBoundingClientRect().height;
      searchBarPlaceholderRef.current.style.height = `${heigth}px`;
    }
  }, []);

  const [search, setSearch] = useState("");
  const [filteredPrompts, setFilteredPrompts] = useState(
    Object.entries(prompts).map((entry, index) => ({ entry, index }))
  );

  useEffect(() => {
    const results = Object.entries(prompts)
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry: [keyword] }) =>
        keyword.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredPrompts(results);
  }, [search, prompts]);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(prompts)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "prompts.json";
    a.click();
  };

  const handleAddClick = () => {
    navigate("/create");
  };

  const handleItemClick = (index: number) => {
    navigate(`/edit/${index}`);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-10 border-zinc-700">
        <div className="bg-black" ref={searchBarRef}>
          <SearchBar onSearch={setSearch} onDownload={handleDownload} onAdd={handleAddClick} />
          <div className="px-4 py-1 text-xs text-zinc-500">
            {filteredPrompts.length} of {Object.entries(prompts).length} prompts
          </div>
        </div>
      </div>
      <div ref={searchBarPlaceholderRef} />
      <div className="p-2">
        {filteredPrompts.map(({ entry: [keyword, text], index }) => (
          <SearchResult
            key={index}
            keyword={keyword}
            text={text}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </div>
    </>
  );
};

export default SearchPage;
