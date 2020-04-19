
type AcrossClues = { [key: string]: string };
type DownClues = { [key: number]: string };
type Clues = { across: AcrossClues, down: DownClues };
type Direction = 'across' | 'down';
type ArrowDirection = 'left' | 'right' | 'up' | 'down';
type Row = Array<{ focused?: boolean, highlighted?: boolean, number: number, value: string }>;
type Grid = Array<Row>;
type SimpleGrid = Array<Array<{ value: string }>>;
type EnumeratedGrid = Array<Array<{ number: number, value: string }>>;
type Cell = { row: number, col: number };
type NextCell = { nextRow: number, nextCol: number };

export const INIT_SIZE = 9;

function getGrid(size: number): SimpleGrid {
  return Array.from({length: size}, e => Array.from({length: size}, e => ({ value: '' })));
}

export function initializeGrid(size: number): Grid {
  const initialGrid = getGrid(size || INIT_SIZE);
  const enumeratedGrid = enumerate(initialGrid);
  const highlightedGrid = highlightWordAcross(0, 0, enumeratedGrid);
  highlightedGrid[0][0].focused = true;
  return highlightedGrid;
}

function getAcrossCluesFromRow(grid: Grid, gridRow: Row, row: number, clues?: Clues): AcrossClues {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (colToLeftIsBlank(row, col, grid) && !colToRightIsBlank(row, col, grid)) {
      const number = grid[row][col].number;
      const clue = (clues && clues.across[number]) || '';
      return {
        ...acc,
        [number]: clue,
      };
    }
    return acc;
  }, {});
}

function getAcrossClues(grid: Grid, clues?: Clues): AcrossClues {
  return grid.reduce((acc, gridRow, row) => {
    return {
      ...acc,
      ...getAcrossCluesFromRow(grid, gridRow, row, clues),
    };
  }, {});
}

function getDownCluesFromRow(grid: Grid, gridRow: Row, row: number, clues?: Clues): DownClues {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (rowAboveIsBlank(row, col, grid) && !rowBelowIsBlank(row, col, grid)) {
      const number = grid[row][col].number;
      const clue = (clues && clues.down[number]) || '';
      return {
        ...acc,
        [number]: clue,
      };
    }
    return acc;
  }, {});
}

function getDownClues(grid: Grid, clues?: Clues): DownClues {
  // return grid.map((gridRow, row) => getDownCluesFromRow(grid, gridRow, row)).flat();
  return grid.reduce((acc, gridRow, row) => {
    return {
      ...acc,
      ...getDownCluesFromRow(grid, gridRow, row, clues),
    };
  }, {});
}

export function initializeClues(grid: Grid): Clues {
  return {
    across: getAcrossClues(grid),
    down: getDownClues(grid),
  };
}

export function updateClueState(grid: Grid, clues: Clues): Clues {
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
			return { ...cell, number: counter++ };
		} else {
			return { ...cell, number: null };
		}
	}));
}

export function isValidCell(row: number, col: number, grid: Grid): boolean {
	return row < grid.length && col < grid[0].length;
}

function getLeftAdjacentCell(row: number, col: number, grid: Grid): NextCell {
  if (colToLeftIsBlank(row, col, grid)) {
    return { nextRow: row, nextCol: col };
  }
  return { nextRow: row, nextCol: col-1 };
}

function getRightAdjacentCell(row: number, col: number, grid: Grid): NextCell {
  if (colToRightIsBlank(row, col, grid)) {
    return { nextRow: row, nextCol: col };
  }
  return { nextRow: row, nextCol: col+1 };
}

function getUpAdjacentCell(row: number, col: number, grid: Grid): NextCell {
  if (rowAboveIsBlank(row, col, grid)) {
    return { nextRow: row, nextCol: col };
  }
  return { nextRow: row-1, nextCol: col };
}

function getDownAdjacentCell(row: number, col: number, grid: Grid): NextCell {
  if (rowBelowIsBlank(row, col, grid)) {
    return { nextRow: row, nextCol: col };
  }
  return { nextRow: row+1, nextCol: col };
}

function getNextAcrossCell(row: number, col: number, grid: Grid): NextCell {
	if (!colToRightIsBlank(row, col, grid)) {
		return { nextRow: row, nextCol: col+1 };
	}
	if (isValidCell(row, col+2, grid)) {
		return getNextAcrossCell(row, col+1, grid);
	}
	if (isValidCell(row+1, 0, grid) && !rowBelowIsBlank(row, 0, grid)) {
		return { nextRow: row+1, nextCol: 0 };
	}
	if (isValidCell(row+1, 0, grid)) {
		return getNextAcrossCell(row+1, 0, grid);
	}
	return { nextRow: 0, nextCol: 0 };
}

function getNextDownCell(row: number, col: number, grid: Grid): NextCell {
	if (!rowBelowIsBlank(row, col, grid)) {
		return { nextRow: row+1, nextCol: col };
	}
	if (isValidCell(row+2, col, grid)) {
		return getNextDownCell(row+1, col, grid);
	}
	if (isValidCell(0, col+1, grid) && !colToRightIsBlank(0, col, grid)) {
		return { nextRow: 0, nextCol: col+1 };
	}
	if (isValidCell(0, col+1, grid)) {
		return getNextDownCell(0, col+1, grid);
	}
	return { nextRow: 0, nextCol: 0 };
}

export function getNextCell(row: number, col: number, grid: Grid, direction: Direction): NextCell {
	if (direction === 'across') {
		return getNextAcrossCell(row, col, grid);
	}
	return getNextDownCell(row, col, grid);
}

export function clearFocus(grid: Grid): Grid {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, focused: false })));
}

export function clearHighlights(grid: Grid): Grid {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, highlighted: false})));
}

export function advanceFocus(row: number, col: number, grid: Grid, direction: Direction) {
	const gridCopy = clearFocus(grid);
	const { nextRow, nextCol } = getNextCell(row, col, gridCopy, direction);
	gridCopy[nextRow][nextCol].focused = true;
	return gridCopy;
}

export function stepFocus(row: number, col: number, grid: Grid, arrowDirection: ArrowDirection): Grid {
  const gridCopy = clearFocus(grid);
  if (arrowDirection === 'left') {
    const { nextRow, nextCol } = getLeftAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  } else if (arrowDirection === 'right') {
    const { nextRow, nextCol } = getRightAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  } else if (arrowDirection === 'up') {
    const { nextRow, nextCol } = getUpAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  } else if (arrowDirection === 'down') {
    const { nextRow, nextCol } = getDownAdjacentCell(row, col, grid);
    gridCopy[nextRow][nextCol].focused = true;
  }
  return gridCopy;
}

export function findFocus(grid: Grid): Cell {
	for (let row=0; row < grid.length; row++) {
		for (let col=0; col < grid[row].length; col++) {
			if (grid[row][col].focused) {
				return {row, col};
			}
		}
	}
	return {row: 0, col: 0};
}

export function findCellFromNumber(grid: Grid, number: number): Cell {
  for (let row=0; row < grid.length; row++) {
    for (let col=0; col < grid[row].length; col++) {
      if (grid[row][col].number === parseInt(number + '')) {
        return {row, col};
      }
    }
  }
  return {row: 0, col: 0};
}

function setAnswerAcross(row: number, col: number, grid: Grid, answer: string): Grid {
  const gridCopy = [...grid];
  let i = 0;
  gridCopy[row][col].value = answer[i++];
  let nextCol = col;
  while(!colToRightIsBlank(row, nextCol++, grid) && i < answer.length) {
    gridCopy[row][nextCol].value = answer[i++];
  }
  return gridCopy;
}

function setAnswerDown(row: number, col: number, grid: Grid, answer: string): Grid {
  const gridCopy = [...grid];
  let i = 0;
  gridCopy[row][col].value = answer[i++];
  let nextRow = row;
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    gridCopy[nextRow][col].value = answer[i++];
  }
  return gridCopy;
}

export function getGridWithAnswer(gridState: Grid, answer: string, answerNumber: number, answerDirection: Direction): Grid {
  const { row, col } = findCellFromNumber(gridState, answerNumber);
  let gridWithAnswer;
  if (answerDirection === 'across') {
    gridWithAnswer = setAnswerAcross(row, col, gridState, answer);
  } else {
    gridWithAnswer = setAnswerDown(row, col, gridState, answer);
  }
  return gridWithAnswer;
}

function findStartOfAcrossWord(row: number, col: number, grid: Grid): Cell {
  let startCol = col;
  while(!colToLeftIsBlank(row, startCol, grid)) {
    startCol--;
  }
  return { row, col: startCol };
}

function findStartOfDownWord(row: number, col: number, grid: Grid): Cell {
  let startRow = row;
  while(!rowAboveIsBlank(startRow, col, grid)) {
    startRow--;
  }
  return { row: startRow, col };
}

function findStartOfWord(row: number, col: number, direction: Direction, grid: Grid): Cell {
  if (direction === 'across') {
    return findStartOfAcrossWord(row, col, grid);
  }
  return findStartOfDownWord(row, col, grid);
}

export function highlightWordAcross(row: number, col: number, grid: Grid): Grid {
	const gridCopy = clearHighlights(grid);
	let { col: startCol } = findStartOfWord(row, col, 'across', gridCopy);
	gridCopy[row][startCol].highlighted = true;
	while(!colToRightIsBlank(row, startCol++, gridCopy)) {
    gridCopy[row][startCol].highlighted = true;
	}
	return gridCopy;
}

export function highlightWordDown(currRow: number, currCol: number, grid: Grid): Grid {
	const gridCopy = clearHighlights(grid);
	let { row } = findStartOfWord(currRow, currCol, 'down', gridCopy);
  gridCopy[row][currCol].highlighted = true;
	while(!rowBelowIsBlank(row++, currCol, gridCopy)) {
		gridCopy[row][currCol].highlighted = true;
	}
	return gridCopy;
}

export function highlightWord(row: number, col: number, grid: Grid, direction: Direction): Grid {
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
