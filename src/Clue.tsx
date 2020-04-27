import React, { MouseEvent } from 'react';

import './Clue.css';

import type {
  ClueState,
  Direction,
} from './types';

type Props = {
  number: string,
  direction: Direction,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
  clue: ClueState,
};

export default function Clue(props: Props) {
  const {
    number,
    direction,
    onNumberClick,
    onClueUpdate,
    clue,
  } = props;

  return (
    <div className="flex" key={number + direction}>
      <div 
        className="rightJustify pointer"
        onClick={(e) => onNumberClick(e, number, direction)}
      >
        {number}:
      </div>
      <textarea
        className="clue"
        key={number + direction}
        onChange={(e) => onClueUpdate(number, direction, e.target.value)}
        onFocus={(e) => onClueUpdate(number, direction, e.target.value)}
        value={clue.clue}
      />
    </div>
  );
}
