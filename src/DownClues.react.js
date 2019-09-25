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
  return grid.map((gridRow, row) => getDownCluesFromRow(grid, gridRow, row)).flat().join(', ');
}

export default function AcrossClues({ gridState }) {
	return (
		<div>
      <h4>Down</h4>
      {getDownClues(gridState)}
    </div>
	);
}

