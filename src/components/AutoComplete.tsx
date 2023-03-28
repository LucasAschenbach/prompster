import React, { useState, useEffect, useRef } from 'react';
import SuggestionList from './SuggestionList';
import './AutoComplete.css';

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
    console.log('key pressed', e.key);
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
      // case 'Escape':
      //   e.stopPropagation();
      //   break;
      default:
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  return (
    <div className="auto-complete">
      <input
        type="text"
        value={input}
        onChange={(e) => updateSuggestions(e.target.value)}
        onKeyDown={handleKeyPress}
        autoFocus
      />
      <SuggestionList
        suggestions={suggestions}
        selectedIndex={selectedIndex}
        onSelect={updateSuggestions}
      />
    </div>
  );
};
    
export default AutoComplete;
