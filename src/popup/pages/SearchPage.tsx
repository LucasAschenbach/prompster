import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";

import promptsData from "../../../static/prompts.json";

const SearchPage = () => {
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
    Object.entries(promptsData).map((entry, index) => ({ entry, index }))
  );
  
  useEffect(() => {
    const results = Object.entries(promptsData)
      .map((entry, index) => ({ entry, index }))
      .filter(({ entry: [keyword] }) =>
        keyword.toLowerCase().includes(search.toLowerCase())
      );
    setFilteredPrompts(results);
  }, [search]);
  

  const handleItemClick = (index: number) => {
    navigate(`/edit/${index}`);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-10 border-zinc-700">
        <div className="bg-black" ref={searchBarRef}>
          <SearchBar onSearch={setSearch} />
          <div className="px-4 py-1 text-xs text-zinc-500">
            {filteredPrompts.length} of {Object.entries(promptsData).length}{" "}
            prompts
          </div>
        </div>
      </div>
      <div ref={searchBarPlaceholderRef} />
      <div className="p-2">
        {filteredPrompts.map(({ entry: [keyword, text], index }) => (
          <SearchResult
            key={index}
            keyword={keyword}
            text={text as string}
            onClick={() => handleItemClick(index)}
          />
        ))}
      </div>
    </>
  );
};

export default SearchPage;
