import React, { MouseEvent } from 'react';

import AcrossClues from './AcrossClues';
import DownClues from './DownClues';
import './Clues.css';

import type {
  ClueState,
  Direction,
} from './types';

type Props = {
  clueState: ClueState,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
};

export default function Clues({ clueState, onClueUpdate, onNumberClick }: Props) {
	return (
    <div className="contents">
      <AcrossClues 
        clueState={clueState} 
        onClueUpdate={onClueUpdate} 
        onNumberClick={onNumberClick}
      />
      <DownClues 
        clueState={clueState} 
        onClueUpdate={onClueUpdate} 
        onNumberClick={onNumberClick}
      />
    </div>
	);
}
