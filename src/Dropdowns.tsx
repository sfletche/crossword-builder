import React from 'react';
import { Select } from 'baseui/select';

import './Clues.css';

import type {
  Direction,
} from './types';

type Option = {
  label: string,
  id: string,
};

type Props = {
  answers: Array<string>,
  clues: Array<string>,
  onAnswerSelect: (answer: string) => void,
  onClueSelect: (clue: string, direction: Direction) => void,
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
  console.log('clues', clues);
  const clueOptions: Array<Option> = clues.map(clue => ({ label: clue, id: clue }));
  const answerOptions: Array<Option> = answers.map(answer => ({ label: answer, id: answer }));

  return (
    <div style={{ display: 'flex', minWidth: '250px' }}>
      {showAnswersDropdown && 
        <Select 
          options={answerOptions}
          placeholder="Select an answer"
          onChange={params => onAnswerSelect(params.option.label as string)}
        />
      }
      {showAcrossCluesDropdown && 
        <Select 
          options={clueOptions}
          placeholder="Select a clue"
          onChange={params => onClueSelect(params.option.label as string, 'across')}
        />
      }
      {showDownCluesDropdown && 
        <Select 
          options={clueOptions}
          placeholder="Select a clue"
          onChange={params => onClueSelect(params.option.label as string, 'down')}
        />
      }
    </div>
  );
}
