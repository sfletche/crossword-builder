import React from 'react';
import {
  rowAboveIsBlank,
  rowBelowIsBlank,
} from './utils/utils';

function getDownCluesFromRow(grid, gridRow, row) {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (rowAboveIsBlank(row, col, grid) && !rowBelowIsBlank(row, col, grid)) {
      return [...acc, grid[row][col].number];
    }
    return acc;
  }, []);
}

function getDownClues(grid) {
  return grid.map((gridRow, row) => getDownCluesFromRow(grid, gridRow, row)).flat();
}

export default function DownClues({ gridState }) {
  const clues = getDownClues(gridState);
	return (
		<div className="mt50">
      <h4 className="mb5">Down</h4>
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
