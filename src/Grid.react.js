import React from 'react';
import GridCell from './GridCell.react';
import './Grid.css';


function getGrid(size) {
	return Array.from({length: size}, e => Array.from({length: size}, e => ({ value: '' })));
}

function rowAboveIsBlank(row, col, grid) {
	return row === 0 || grid[row-1][col].value === 'BLANK';
}

function rowBelowIsBlank(row, col, grid) {
	return row === grid.length -1 || grid[row+1][col].value === 'BLANK';
}

function colToLeftIsBlank(row, col, grid) {
	return col === 0 || grid[row][col-1].value === 'BLANK';
}

function colToRightIsBlank(row, col, grid) {
	return col === grid[row].length -1 || grid[row][col+1].value === 'BLANK';
}

function shouldHaveNumber(row, col, grid) {
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

function enumerate(grid) {
	let counter = 1;
	return grid.map((gridRow, row) => gridRow.map((cell, col) => {
		if (shouldHaveNumber(row, col, grid)) {
			return { ...cell, number: counter++ };
		} else {
			return { ...cell, number: null };
		}
	}));	
}

function isValidCell(row, col, grid) {
	return row < grid.length && col < grid[0].length;
}

function getNextCell(row, col, grid) {
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

function clearFocus(grid) {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, focused: false })));	
}

function clearHighlights(grid) {
	return grid.map(gridRow => gridRow.map(cell => ({ ...cell, highlighted: false})));	
}

function advanceFocus(row, col, grid) {
	const gridCopy = clearFocus(grid);
	const { nextRow, nextCol } = getNextCell(row, col, gridCopy);
	gridCopy[nextRow][nextCol].focused = true;
	return gridCopy;
}

function findFocus(grid) {
	for (let row=0; row< grid.length; row++) {
		for (let col=0; col<grid[row].length; col++) {
			if (grid[row][col].focused) {
				return {row, col};
			} 
		}
	}
	return {row: 0, col: 0};
}

function highlightWord(row, col, grid, direction) {
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


export default class Grid extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gridSize: 0,
			gridState: null,
		};

		this.handleToggleBlank = this.handleToggleBlank.bind(this);
		this.handleLetterClick = this.handleLetterClick.bind(this);
		this.handleLetterChange = this.handleLetterChange.bind(this);
	}

	componentDidMount() {
		const { size: gridSize } = this.props;
		const grid = getGrid(gridSize);
		const gridState = enumerate(grid);
		this.setState({ 
			gridState,
			gridSize,
		});
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const { size: gridSize } = nextProps;
		if (gridSize !== prevState.gridSize) {
			const gridState = getGrid(gridSize);
			return {
				gridSize,
				gridState,
			};
		}
		return null;
	}

	handleToggleBlank(row, col) {
		const { gridSize, gridState } = this.state;
		const { inputType } = this.props;
		if (inputType === 'letters') {
			return;
		}
		const gridCopy = [...gridState];
		if(gridCopy[row][col].value === 'BLANK') {
			gridCopy[row][col].value = '';
			gridCopy[gridSize - row - 1][gridSize - col - 1].value = '';
		} else {
			gridCopy[row][col].value = 'BLANK';
			gridCopy[gridSize - row - 1][gridSize - col - 1].value = 'BLANK';
		}
		const numberedGrid = enumerate(gridCopy);
		this.setState({ gridState: numberedGrid });
	}

	handleLetterClick(row, col) {
		const { gridState } = this.state;
		const { direction, inputType } = this.props;
		if (inputType === 'blanks') {
			return;
		}		
		const gridCopy = clearFocus(gridState);
		gridCopy[row][col].focused = true;
		const gridWithHighlight = highlightWord(row, col, gridCopy, direction);
		this.setState({ gridState: gridWithHighlight });
	}

	handleLetterChange(row, col, val) {
		const { gridState } = this.state;
		const { direction, inputType } = this.props;
		if (inputType === 'blanks') {
			return;
		}
		const gridCopy = clearFocus(gridState);
		gridCopy[row][col].focused = true;
		const newVal = val && val[0] && val[0].toUpperCase();
		gridCopy[row][col].value = newVal;
		if (newVal) {
			const gridWithFocus = advanceFocus(row, col, gridCopy);
			const focusedCell = findFocus(gridWithFocus);
			if (!gridWithFocus[focusedCell.row][focusedCell.col].highlighted) {
				const gridWithHighlight = highlightWord(focusedCell.row, focusedCell.col, gridWithFocus, direction);
				this.setState({ gridState: gridWithHighlight });
			} else {
				this.setState({ gridState: gridWithFocus });
			}
		} else {
			this.setState({ gridState: gridCopy });
		}
	}

	render() {
		const { gridState } = this.state;
		return gridState && (
		  <table className="grid">
		  	<tbody>
			  	{gridState.map((gridRow, row) => 
			  		<tr key={row} className="tableRow">
			  			{gridRow.map((gridCell, col) => 
			  				<td key={col} className="tableCell">
			  					<GridCell 
			  						key={`${row},${col}`}
			  						row={row} 
			  						col={col} 
			  						value={gridState[row][col].value} 
			  						number={gridState[row][col].number}
			  						focused={gridState[row][col].focused}
			  						highlighted={gridState[row][col].highlighted}
			  						onLetterChange={this.handleLetterChange}
			  						onLetterClick={this.handleLetterClick}
			  						onToggleBlank={this.handleToggleBlank} 
		  						/>
			  				</td>
			  			)}
		  			</tr>
					)}
				</tbody>
		  </table>
		);
	}
}