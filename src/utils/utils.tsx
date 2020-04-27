
import type {
  AcrossClues,
  DownClues,
  CluesState,
  Direction,
  ArrowDirection,
  RowState,
  GridState,
  SimpleGrid,
  EnumeratedGrid,
  CellState,
} from '../types';

export const INIT_SIZE = 9;

function getGrid(size: number): SimpleGrid {
  return Array.from({length: size}, e => Array.from({length: size}, e => ({ value: '' })));
}

export function initializeGrid(size: number): GridState {
  const initialGrid = getGrid(size || INIT_SIZE);
  const enumeratedGrid = enumerate(initialGrid);
  const highlightedGrid = highlightWordAcross(0, 0, enumeratedGrid);
  highlightedGrid[0][0].focused = true;
  return highlightedGrid;
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

export function rowAboveIsBlank(row: number, col: number, grid: SimpleGrid): boolean {
	return row === 0 || grid[row-1][col].value === 'BLANK';
}

export function rowBelowIsBlank(row: number, col: number, grid: SimpleGrid): boolean {
	return row === grid.length -1 || grid[row+1][col].value === 'BLANK';
}

export function colToLeftIsBlank(row: number, col: number, grid: SimpleGrid): boolean {
	return col === 0 || grid[row][col-1].value === 'BLANK';
}

export function colToRightIsBlank(row: number, col: number, grid: SimpleGrid): boolean {
	return col === grid[row].length -1 || grid[row][col+1].value === 'BLANK';
}

export function shouldHaveNumber(row: number, col: number, grid: SimpleGrid): boolean {
	if (grid[row][col].value === 'BLANK') {
		return false;
	}
	if (rowAboveIsBlank(row, col, grid) && !rowBelowIsBlank(row, col, grid)) {
		return true;
	}
	if (colToLeftIsBlank(row, col, grid) && !colToRightIsBlank(row, col, grid)) {
		return true;
	}
	return false;
}

export function enumerate(grid: SimpleGrid): EnumeratedGrid {
	let counter = 1;
	return grid.map((gridRow, row) => gridRow.map((cell, col) => {
		if (shouldHaveNumber(row, col, grid)) {
			return { ...cell, number: '' + counter++ };
		} else {
			return { ...cell, number: null };
		}
	}));
}

export function isValidCell(row: number, col: number, grid: GridState): boolean {
	return row < grid.length && col < grid[0].length;
}

function getLeftAdjacentCell(row: number, col: number, grid: GridState): CellState {
  if (colToLeftIsBlank(row, col, grid)) {
    return { row, col };
  }
  return { row, col: col-1 };
}

function getRightAdjacentCell(row: number, col: number, grid: GridState): CellState {
  if (colToRightIsBlank(row, col, grid)) {
    return { row, col };
  }
  return { row, col: col+1 };
}

function getUpAdjacentCell(row: number, col: number, grid: GridState): CellState {
  if (rowAboveIsBlank(row, col, grid)) {
    return { row, col };
  }
  return { row: row-1, col };
}

function getDownAdjacentCell(row: number, col: number, grid: GridState): CellState {
  if (rowBelowIsBlank(row, col, grid)) {
    return { row, col };
  }
  return { row: row+1, col };
}

function getNextAcrossCell(row: number, col: number, grid: GridState): CellState {
	if (!colToRightIsBlank(row, col, grid)) {
		return { row, col: col+1 };
	}
	if (isValidCell(row, col+2, grid)) {
		return getNextAcrossCell(row, col+1, grid);
	}
	if (isValidCell(row+1, 0, grid) && !rowBelowIsBlank(row, 0, grid)) {
		return { row: row+1, col: 0 };
	}
	if (isValidCell(row+1, 0, grid)) {
		return getNextAcrossCell(row+1, 0, grid);
	}
	return { row: 0, col: 0 };
}

function getNextDownCell(row: number, col: number, grid: GridState): CellState {
	if (!rowBelowIsBlank(row, col, grid)) {
		return { row: row+1, col };
	}
	if (isValidCell(row+2, col, grid)) {
		return getNextDownCell(row+1, col, grid);
	}
	if (isValidCell(0, col+1, grid) && !colToRightIsBlank(0, col, grid)) {
		return { row: 0, col: col+1 };
	}
	if (isValidCell(0, col+1, grid)) {
		return getNextDownCell(0, col+1, grid);
	}
	return { row: 0, col: 0 };
}

export function getNextCell(row: number, col: number, grid: GridState, direction: Direction): CellState {
	if (direction === 'across') {
		return getNextAcrossCell(row, col, grid);
	}
	return getNextDownCell(row, col, grid);
}

export function clearFocus(grid: GridState): GridState {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, focused: false })));
}

export function setFocus(grid: GridState, row: number, col: number): GridState {
  return grid.map((gridRow, rowNum) => gridRow.map((cell, colNum) => {
    if (rowNum == row && colNum == col) {
      return { ...cell, focused: true };
    } 
    return { ...cell, focused: false };
  }));
}

export function clearGridHighlights(grid: GridState): GridState {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, highlighted: false})));
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

export function advanceFocus(row: number, col: number, grid: GridState, direction: Direction) {
	const gridCopy = clearFocus(grid);
	const { row: nextRow, col: nextCol } = getNextCell(row, col, gridCopy, direction);
	gridCopy[nextRow][nextCol].focused = true;
	return gridCopy;
}

export function stepFocus(row: number, col: number, grid: GridState, arrowDirection: ArrowDirection): GridState {
  const gridCopy = clearFocus(grid);
  if (arrowDirection === 'left') {
    const { row: nextRow, col: nextCol } = getLeftAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  } else if (arrowDirection === 'right') {
    const { row: nextRow, col: nextCol } = getRightAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  } else if (arrowDirection === 'up') {
    const { row: nextRow, col: nextCol } = getUpAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  } else if (arrowDirection === 'down') {
    const { row: nextRow, col: nextCol } = getDownAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  }
  return gridCopy;
}

export function findFocus(grid: GridState): CellState {
	for (let row=0; row < grid.length; row++) {
		for (let col=0; col < grid[row].length; col++) {
			if (grid[row][col].focused) {
				return {row, col};
			}
		}
	}
	return { row: 0, col: 0 };
}

export function findCellFromNumber(grid: GridState, number: string): CellState {
  for (let row=0; row < grid.length; row++) {
    for (let col=0; col < grid[row].length; col++) {
      if (grid[row][col].number == number) {
        return {row, col};
      }
    }
  }
  return { row: 0, col: 0 };
}

function setAnswerAcross(row: number, col: number, grid: GridState, answer: string): GridState {
  const gridCopy = [...grid];
  let i = 0;
  gridCopy[row][col].value = answer[i++];
  let nextCol = col;
  while(!colToRightIsBlank(row, nextCol++, grid) && i < answer.length) {
    gridCopy[row][nextCol].value = answer[i++];
  }
  return gridCopy;
}

function setAnswerDown(row: number, col: number, grid: GridState, answer: string): GridState {
  const gridCopy = [...grid];
  let i = 0;
  gridCopy[row][col].value = answer[i++];
  let nextRow = row;
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    gridCopy[nextRow][col].value = answer[i++];
  }
  return gridCopy;
}

export function getGridWithAnswer(gridState: GridState, answer: string, answerNumber: string, answerDirection: Direction): GridState {
  const { row, col } = findCellFromNumber(gridState, answerNumber);
  let gridWithAnswer;
  if (answerDirection === 'across') {
    gridWithAnswer = setAnswerAcross(row, col, gridState, answer);
  } else {
    gridWithAnswer = setAnswerDown(row, col, gridState, answer);
  }
  return gridWithAnswer;
}

function findStartOfAcrossWord(row: number, col: number, grid: GridState): CellState {
  let startCol = col;
  while(!colToLeftIsBlank(row, startCol, grid)) {
    startCol--;
  }
  return { row, col: startCol };
}

function findStartOfDownWord(row: number, col: number, grid: GridState): CellState {
  let startRow = row;
  while(!rowAboveIsBlank(startRow, col, grid)) {
    startRow--;
  }
  return { row: startRow, col };
}

function findStartOfWord(row: number, col: number, direction: Direction, grid: GridState): CellState {
  if (direction === 'across') {
    return findStartOfAcrossWord(row, col, grid);
  }
  return findStartOfDownWord(row, col, grid);
}

export function findAcrossClueNumber(row: number, col: number, grid: GridState): string {
  const { row: startRow, col: startCol } = findStartOfAcrossWord(row, col, grid);
  return grid[startRow][startCol].number;
}

export function findDownClueNumber(row: number, col: number, grid: GridState): string {
  const { row: startRow, col: startCol } = findStartOfDownWord(row, col, grid);
  return grid[startRow][startCol].number;
}

export function highlightWordAcross(row: number, col: number, grid: GridState): GridState {
	const gridCopy = clearGridHighlights(grid);
	let { col: startCol } = findStartOfWord(row, col, 'across', gridCopy);
	gridCopy[row][startCol].highlighted = true;
	while(!colToRightIsBlank(row, startCol++, gridCopy)) {
    gridCopy[row][startCol].highlighted = true;
	}
	return gridCopy;
}

export function highlightWordDown(row: number, col: number, grid: GridState): GridState {
	const gridCopy = clearGridHighlights(grid);
	let { row: startRow } = findStartOfWord(row, col, 'down', gridCopy);
  gridCopy[startRow][col].highlighted = true;
	while(!rowBelowIsBlank(startRow++, col, gridCopy)) {
		gridCopy[startRow][col].highlighted = true;
	}
	return gridCopy;
}

export function highlightWord(row: number, col: number, grid: GridState, direction: Direction): GridState {
	if (direction === 'across') {
		return highlightWordAcross(row, col, grid);
	}
	return highlightWordDown(row, col, grid);
}

export function slugify(str: string): string {
  return str.replace(/^\s+|\s+$/g, '')
  // Make the string lowercase
  .toLowerCase()
  // Remove invalid chars
  .replace(/[^a-z0-9 -]/g, '')
  // Collapse whitespace and replace by -
  .replace(/\s+/g, '-')
  // Collapse dashes
  .replace(/-+/g, '-');
}
