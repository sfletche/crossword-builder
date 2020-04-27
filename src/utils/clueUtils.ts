
import {
  colToLeftIsBlank,
  colToRightIsBlank,
  findStartOfAcrossWord,
  findStartOfDownWord,
  rowAboveIsBlank,
  rowBelowIsBlank,
} from './gridUtils';

import type {
  AcrossClues,
  DownClues,
  CluesState,
  RowState,
  GridState,
} from '../types';

export function findAcrossClueNumber(row: number, col: number, grid: GridState): string {
  const { row: startRow, col: startCol } = findStartOfAcrossWord(row, col, grid);
  return grid[startRow][startCol].number;
}

export function findDownClueNumber(row: number, col: number, grid: GridState): string {
  const { row: startRow, col: startCol } = findStartOfDownWord(row, col, grid);
  return grid[startRow][startCol].number;
}

function getAcrossCluesFromRow(grid: GridState, gridRow: RowState, row: number, clues?: CluesState): AcrossClues {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (colToLeftIsBlank(row, col, grid) && !colToRightIsBlank(row, col, grid)) {
      const number = grid[row][col].number;
      const clue = (clues && clues.across[number] && clues.across[number].clue) || '';
      return {
        ...acc,
        [number]: { clue, highlighted: false },
      };
    }
    return acc;
  }, {});
}

function getAcrossClues(grid: GridState, clues?: CluesState): AcrossClues {
  return grid.reduce((acc, gridRow, row) => {
    return {
      ...acc,
      ...getAcrossCluesFromRow(grid, gridRow, row, clues),
    };
  }, {});
}

function getDownCluesFromRow(grid: GridState, gridRow: RowState, row: number, clues?: CluesState): DownClues {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (rowAboveIsBlank(row, col, grid) && !rowBelowIsBlank(row, col, grid)) {
      const number = grid[row][col].number;
      const clue = (clues && clues.down[number]) || '';
      return {
        ...acc,
        [number]: { clue, highlighted: false },
      };
    }
    return acc;
  }, {});
}

function getDownClues(grid: GridState, clues?: CluesState): DownClues {
  // return grid.map((gridRow, row) => getDownCluesFromRow(grid, gridRow, row)).flat();
  return grid.reduce((acc, gridRow, row) => {
    return {
      ...acc,
      ...getDownCluesFromRow(grid, gridRow, row, clues),
    };
  }, {});
}

export function initializeClues(grid: GridState): CluesState {
  return {
    across: getAcrossClues(grid),
    down: getDownClues(grid),
  };
}

export function updateCluesState(grid: GridState, clues: CluesState): CluesState {
  return {
    across: getAcrossClues(grid, clues),
    down: getDownClues(grid, clues),
  };
}

export function clearClueHighlights(clues: CluesState): CluesState {
  debugger;
  const { across, down } = clues;
  const acrossClues = Object.keys(across).reduce((acc, key) => {
    return {
      ...acc,
      [key]: { ...clues.across[key], highlighted: false },
    };
  }, {});
  const downClues = Object.keys(down).reduce((acc, key) => {
    return {
      ...acc,
      [key]: { ...clues.down[key], highlighted: false },
    };
  }, {});
  return { across: acrossClues, down: downClues };
}
