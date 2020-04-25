import React, { MouseEvent } from 'react';

import './Clue.css';

import type {
  Direction,
} from './types';

type Props = {
  number: string,
  direction: Direction,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
  value: string,
};

export default function Clue(props: Props) {
  const {
    number,
    direction,
    onNumberClick,
    onClueUpdate,
    value,
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
        value={value}
      />
    </div>
  );
}
