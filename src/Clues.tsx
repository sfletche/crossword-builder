import React, { MouseEvent } from 'react';

import AcrossClues from './AcrossClues';
import DownClues from './DownClues';
import './Clues.css';

type ClueObject = { [key: string]: string };
type Clues = { across: ClueObject, down: ClueObject };
type Direction = 'across' | 'down';

type Props = {
  clueState: Clues,
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
