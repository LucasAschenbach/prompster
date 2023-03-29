import React, { useState, useEffect, useRef } from 'react';
import SuggestionList from './SuggestionList';
import Card from './Card';

interface Props {
  prompts: Record<string, string>;
  onPromptInsert: (prompt: string) => void;
}

const AutoComplete: React.FC<Props> = ({ prompts, onPromptInsert }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSuggestions = (newInput: string) => {
    setInput(newInput);
    if (newInput) {
      const filteredSuggestions = Object.keys(prompts)
        .filter((key) => key.startsWith(newInput))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((index) => Math.max(0, index - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((index) => Math.min(suggestions.length - 1, index + 1));
        break;
      case 'Tab':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selectedKey = suggestions[selectedIndex];
          onPromptInsert(prompts[selectedKey]);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  return (
    <div className="font-mono prompster absolute w-64 flex flex-col gap-y-1">
      <SuggestionList
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        onSelect={updateSuggestions}
      />
      <Card>
        <div className="flex flex-row items-center">
          <div className="w-4 flex justify-center font-bold">/</div>
          <input
            type="text"
            value={input}
            onChange={(e) => updateSuggestions(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            className="bg-transparent outline-none w-full"
            />
          </div>
      </Card>
    </div>
  );
};
    
export default AutoComplete;
