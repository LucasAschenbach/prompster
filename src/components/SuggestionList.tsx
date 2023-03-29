import React from 'react';
import Card from './Card';

interface Props {
  suggestions: string[];
  selectedIndex: number;
  onSelect: (suggestion: string) => void;
}

const SuggestionList: React.FC<Props> = ({ suggestions, selectedIndex, onSelect }) => {
  return (
    <div className={`w-full ${suggestions.length > 0 ? '' : 'hidden'}`}>
      <Card>
        <ul>
          {suggestions.reverse().map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => onSelect(suggestion)}
              className={`px-2 py-1 cursor-pointer rounded-sm ${
                index === selectedIndex ? 'bg-zinc-700' : ''
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
