import React, { MouseEvent } from 'react';

import Grid from './Grid';
import './Puzzle.css';

import type {
  Direction,
  GridState,
} from './types';

type Props = {
  direction: Direction,
  gridSize: number,
  gridState: GridState,
  inputType: string,
  onDirectionToggle: (grid: GridState) => void,
  onGridUpdate: (grid: GridState) => void,
  onNumberClick: (event: MouseEvent<HTMLSpanElement>, row: number, col: number) => void,
  onSetAcross: (grid: GridState) => void,
  onSetDown: (grid: GridState) => void,
  puzzleHasFocus: boolean,
  title: string,
  updateTitle: (title: string) => void,
};

function Puzzle({
  direction,
  gridSize,
  gridState,
  inputType,
  onDirectionToggle,
  onGridUpdate,
  onNumberClick,
  onSetAcross,
  onSetDown,
  puzzleHasFocus,
  title,
  updateTitle,
}: Props) {
	return (
    <div className="puzzle">
      <textarea
        className="centerHeader title"
        onChange={(e) => updateTitle(e.target.value)}
        value={title}
      />
      <div className="centerTable">
        <Grid
          direction={direction}
          gridSize={gridSize}
          gridState={gridState}
          inputType={inputType}
          onDirectionToggle={onDirectionToggle}
          onGridUpdate={onGridUpdate}
          onNumberClick={onNumberClick}
          onSetAcross={onSetAcross}
          onSetDown={onSetDown}
          puzzleHasFocus={puzzleHasFocus}
        />
      </div>
    </div>
	);
}

export default Puzzle;
