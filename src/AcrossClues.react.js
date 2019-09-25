import React from 'react';
import {
  colToLeftIsBlank,
  colToRightIsBlank,
} from './utils/utils';
import './AcrossClues.css';

function getAcrossCluesFromRow(grid, gridRow, row) {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (colToLeftIsBlank(row, col, grid) && !colToRightIsBlank(row, col, grid)) {
      return [...acc, grid[row][col].number];
    }
    return acc;
  }, []);
}

function getAcrossClues(grid) {
  return grid.map((gridRow, row) => getAcrossCluesFromRow(grid, gridRow, row)).flat();
}

export default function AcrossClues({ gridState }) {
  const clues = getAcrossClues(gridState);
	return (
		<div>
      <h4>Across</h4>
      {clues.map(clue => (
        <div key={clue}>
          <div className="rightJustify">
            {clue}
          </div>
          <textarea className="clue"/>
        </div>
      ))}
    </div>
	);
}

