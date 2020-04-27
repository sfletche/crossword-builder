import React, { MouseEvent } from 'react';

import AcrossClues from './AcrossClues';
import DownClues from './DownClues';
import './Clues.css';

import type {
  CluesState,
  Direction,
} from './types';

type Props = {
  cluesState: CluesState,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
};

export default function Clues({ cluesState, onClueUpdate, onNumberClick }: Props) {
	return (
    <div className="contents">
      <AcrossClues 
        cluesState={cluesState} 
        onClueUpdate={onClueUpdate} 
        onNumberClick={onNumberClick}
      />
      <DownClues 
        cluesState={cluesState} 
        onClueUpdate={onClueUpdate} 
        onNumberClick={onNumberClick}
      />
    </div>
	);
}
