import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchResult from "../components/SearchResult";
import { usePromptContext } from "../../contexts/PromptContext";

const supportUrls: { [key: string]: string } = {
  "firefox": "https://addons.mozilla.org/en-US/firefox/addon/prompster/",
  "chrome": "https://chrome.google.com/webstore/detail/prompster/fbagfekcjdidpmmookklbaeddgkjddml?hl=en&authuser=0",
  "safari": "https://apps.apple.com/us/app/prompster/id1580198847",
}

const SearchPage = () => {
  const { prompts } = usePromptContext();

  const navigate = useNavigate();
  const searchBarRef = useRef<HTMLDivElement>(null);
  const searchBarPlaceholderRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const footerPlaceholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchBarRef.current && searchBarPlaceholderRef.current) {
      const heigth = searchBarRef.current.getBoundingClientRect().height;
      searchBarPlaceholderRef.current.style.height = `${heigth}px`;
    }
    if (footerRef.current && footerPlaceholderRef.current) {
      const heigth = footerRef.current.getBoundingClientRect().height;
      footerPlaceholderRef.current.style.height = `${heigth}px`;
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

  const handleDataClick = () => {
    navigate("/data");
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
          <SearchBar
            onSearch={setSearch}
            onData={handleDataClick}
            onAdd={handleAddClick}
          />
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
      <div ref={footerPlaceholderRef} />
      <div
        className="fixed inset-x-0 bottom-0 z-10 bg-black px-4 py-2 text-zinc-500"
        ref={footerRef}
      >
        <a className="text-xs text-blue-500 hover:underline" href="https://github.com/lucasaschenbach/prompster/issues/new" target="_blank">Feedback</a>
        {" • "}
        <a className="text-xs text-blue-500 hover:underline" href={supportUrls[BROWSER]} target="_blank">Support us</a>
      </div>
    </>
  );
};

export default SearchPage;
