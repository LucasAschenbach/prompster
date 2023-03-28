import React from 'react';
import './SuggestionList.css';

interface Props {
  suggestions: string[];
  selectedIndex: number;
  onSelect: (suggestion: string) => void;
}

const SuggestionList: React.FC<Props> = ({ suggestions, selectedIndex, onSelect }) => (
  <ul className="suggestion-list">
    {suggestions.map((suggestion, index) => (
      <li
        key={suggestion}
        className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
        onClick={() => onSelect(suggestion)}
      >
        {suggestion}
      </li>
    ))}
  </ul>
);

export default SuggestionList;
