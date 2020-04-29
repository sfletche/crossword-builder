import React from 'react';
import Dropdown from 'react-dropdown';

import AcrossClues from './AcrossClues';
import DownClues from './DownClues';
import './Clues.css';

import type {
  CluesState,
  Direction,
} from './types';

type Props = {
  answers: Array<string>,
  clues: Array<string>,
  onAnswerSelect: (answer: { value: string }) => void,
  onClueSelect: (clue: { value: string }, direction: Direction) => void,
  showAcrossCluesDropdown: boolean,
  showAnswersDropdown: boolean,
  showDownCluesDropdown: boolean,
};

export default function Clues(props: Props) {
  const {
    answers,
    clues,
    onAnswerSelect,
    onClueSelect,
    showAcrossCluesDropdown,
    showAnswersDropdown,
    showDownCluesDropdown,
  } = props;

  return (
    <div style={{ display: 'flex', minWidth: '250px' }}>
      {showAnswersDropdown && 
        <Dropdown 
          className="dropdown"
          menuClassName="dropdownMenu"
          onChange={onAnswerSelect} 
          options={answers} 
          placeholder="Select an answer" 
        />
      }
      {showAcrossCluesDropdown && 
        <Dropdown 
          className="clue-dropdown"
          menuClassName="dropdownMenu"
          onChange={clue => onClueSelect(clue, 'across')} 
          options={clues} 
          placeholder="Select a clue" 
        />
      }
      {showDownCluesDropdown && 
        <Dropdown 
          className="clue-dropdown"
          menuClassName="dropdownMenu"
          onChange={clue => onClueSelect(clue, 'down')} 
          options={clues} 
          placeholder="Select a clue" 
        />
      }
    </div>
  );
}
