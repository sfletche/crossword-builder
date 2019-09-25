
export const INIT_SIZE = 9;

function getGrid(size) {
  return Array.from({length: size}, e => Array.from({length: size}, e => ({ value: '' })));
}

export function initializeGrid(size) {
  return enumerate(getGrid(size || INIT_SIZE));
}

export function rowAboveIsBlank(row, col, grid) {
	return row === 0 || grid[row-1][col].value === 'BLANK';
}

export function rowBelowIsBlank(row, col, grid) {
	return row === grid.length -1 || grid[row+1][col].value === 'BLANK';
}

export function colToLeftIsBlank(row, col, grid) {
	return col === 0 || grid[row][col-1].value === 'BLANK';
}

export function colToRightIsBlank(row, col, grid) {
	return col === grid[row].length -1 || grid[row][col+1].value === 'BLANK';
}

export function shouldHaveNumber(row, col, grid) {
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

export function enumerate(grid) {
	let counter = 1;
	return grid.map((gridRow, row) => gridRow.map((cell, col) => {
		if (shouldHaveNumber(row, col, grid)) {
			return { ...cell, number: counter++ };
		} else {
			return { ...cell, number: null };
		}
	}));
}

export function isValidCell(row, col, grid) {
	return row < grid.length && col < grid[0].length;
}

function getNextAcrossCell(row, col, grid) {
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

function getNextDownCell(row, col, grid) {
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

export function getNextCell(row, col, grid, direction) {
	if (direction === 'across') {
		return getNextAcrossCell(row, col, grid);
	}
	return getNextDownCell(row, col, grid);
}

export function clearFocus(grid) {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, focused: false })));
}

export function clearHighlights(grid) {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, highlighted: false})));
}

export function advanceFocus(row, col, grid, direction) {
	const gridCopy = clearFocus(grid);
	const { nextRow, nextCol } = getNextCell(row, col, gridCopy, direction);
	gridCopy[nextRow][nextCol].focused = true;
	return gridCopy;
}

export function findFocus(grid) {
	for (let row=0; row< grid.length; row++) {
		for (let col=0; col<grid[row].length; col++) {
			if (grid[row][col].focused) {
				return {row, col};
			}
		}
	}
	return {row: 0, col: 0};
}

export function highlightWordAcross(row, col, grid) {
	const gridCopy = clearHighlights(grid);
	gridCopy[row][col].highlighted = true;
	let nextCol = col;
	while(!colToLeftIsBlank(row, nextCol--, grid)) {
		gridCopy[row][nextCol].highlighted = true;
	}
	nextCol = col;
	while(!colToRightIsBlank(row, nextCol++, grid)) {
		gridCopy[row][nextCol].highlighted = true;
	}
	return gridCopy;
}

export function highlightWordDown(row, col, grid) {
	const gridCopy = clearHighlights(grid);
	gridCopy[row][col].highlighted = true;
	let nextRow = row;
	while(!rowAboveIsBlank(nextRow--, col, grid)) {
		gridCopy[nextRow][col].highlighted = true;
	}
	nextRow = row;
	while(!rowBelowIsBlank(nextRow++, col, grid)) {
		gridCopy[nextRow][col].highlighted = true;
	}
	return gridCopy;
}

export function highlightWord(row, col, grid, direction) {
	if (direction === 'across') {
		return highlightWordAcross(row, col, grid);
	}
	return highlightWordDown(row, col, grid);
}

export function slugify(str) {
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
