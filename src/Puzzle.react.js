import React from 'react';

import Grid from './Grid.react';
import './Puzzle.css';

export default function Puzzle({
  direction,
  gridSize,
  gridState,
  inputType,
  onDirectionToggle,
  onGridUpdate,
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
          toggleDirection={onDirectionToggle}
          updateGrid={onGridUpdate}
        />
      </div>
    </div>
	);
}