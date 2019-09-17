export function getGrid(size) {
	return Array.from({length: size}, e => Array.from({length: size}, e => ({ value: '' })));
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

export function getNextCell(row, col, grid) {
	if (!colToRightIsBlank(row, col, grid)) {
		return { nextRow: row, nextCol: col+1 };
	}
	if (isValidCell(row, col+2, grid)) {
		return getNextCell(row, col+1, grid);
	}
	if (isValidCell(row+1, 0, grid) && !rowBelowIsBlank(row, 0, grid)) {
		return { nextRow: row+1, nextCol: 0 };
	}
	if (isValidCell(row+1, 0, grid)) {
		return getNextCell(row+1, 0, grid);
	}
	return { nextRow: 0, nextCol: 0 };
}

export function clearFocus(grid) {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, focused: false })));	
}

export function clearHighlights(grid) {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, highlighted: false})));	
}

export function advanceFocus(row, col, grid) {
	const gridCopy = clearFocus(grid);
	const { nextRow, nextCol } = getNextCell(row, col, gridCopy);
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

export function highlightWord(row, col, grid, direction) {
	const gridCopy = clearHighlights(grid);
	if (direction === 'across') {
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
}
