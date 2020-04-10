import React from 'react';
import Dropdown from 'react-dropdown';

export default function Dropdowns({ 
  onAnswerSelect,
  onClueSelect,
  options,
  showAnswers, 
  showAcrossClues, 
  showDownClues, 
}) {
  return (
    <div>
      {showAnswers && 
        <Dropdown 
          className="dropdown"
          menuClassName="dropdownMenu"
          onChange={onAnswerSelect} 
          options={options} 
          placeholder="Select an answer" 
        />
      }
      {showAcrossClues && 
        <Dropdown 
          className="clue-dropdown"
          menuClassName="dropdownMenu"
          onChange={clue => onClueSelect(clue, 'across')} 
          options={options} 
          placeholder="Select a clue" 
        />
      }
      {showDownClues && 
        <Dropdown 
          className="clue-dropdown"
          menuClassName="dropdownMenu"
          onChange={clue => onClueSelect(clue, 'down')} 
          options={options} 
          placeholder="Select a clue" 
        />
      }
    </div>
  );
}
