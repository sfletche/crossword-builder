import React from 'react';

import Grid from './Grid';
import './Puzzle.css';

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
}) {
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
