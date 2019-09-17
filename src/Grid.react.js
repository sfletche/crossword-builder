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
	// const gridCopy = grid
	let counter = 1;
	for (let i=0; i< grid.length; i++) {
		for (let j=0; j<grid[i].length; j++) {
			if (shouldHaveNumber(i, j, grid)) {
				grid[i][j].number = counter++;
			} else {
				grid[i][j].number = null;
			}
		}
	}
	return grid;
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

function advanceFocus(row, col, grid) {
	grid.forEach(gridRow => gridRow.forEach(cell => cell.focused = false));
	const { nextRow, nextCol } = getNextCell(row, col, grid);
	grid[nextRow][nextCol].focused = true;
	return grid;
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

function clearFocus(grid) {
	for (let row=0; row< grid.length; row++) {
		for (let col=0; col<grid[row].length; col++) {
			grid[row][col].focused = false;
		}
	}
	return grid;
}

function clearHighlights(grid) {
	for (let row=0; row< grid.length; row++) {
		for (let col=0; col<grid[row].length; col++) {
			grid[row][col].highlighted = false;
		}
	}
	return grid;
}

function highlightWord(row, col, grid, direction) {
	clearHighlights(grid);
	if (direction === 'across') {
		grid[row][col].highlighted = true;
		let nextCol = col;		
		while(!colToRightIsBlank(row, nextCol++, grid)) {
			grid[row][nextCol].highlighted = true;
		}
		return grid;
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
		const gridCopy = gridState.map(function(rowState) {
	    return rowState.slice();
		});
		clearFocus(gridCopy);
		gridCopy[row][col].focus = true;
		const gridWithHighlight = highlightWord(row, col, gridCopy, direction);
		this.setState({ gridState: gridWithHighlight });
	}

	handleLetterChange(row, col, val) {
		const { gridState } = this.state;
		const { direction, inputType } = this.props;
		if (inputType === 'blanks') {
			return;
		}
		const gridCopy = gridState.map(function(rowState) {
	    return rowState.slice();
		});
		clearFocus(gridCopy);
		gridCopy[row][col].focus = true;
		const newVal = val && val[0] && val[0].toUpperCase();
		gridCopy[row][col].value = newVal;
		if (newVal) {
			const gridWithFocus = advanceFocus(row, col, gridCopy);
			const focusCell = findFocus(gridWithFocus);
			if (!gridCopy[focusCell.row][focusCell.col].highlighted) {
				let gridWithHighlight;
				if (focusCell.row === row || focusCell.col === col+1) {
					gridWithHighlight = highlightWord(row, col, gridWithFocus, direction);
				} else {
					gridWithHighlight = highlightWord(focusCell.row, focusCell.col, gridWithFocus, direction);
				}
				this.setState({ gridState: gridWithHighlight });
			}
		} else {
			this.setState({ gridState: gridCopy });
		}
	}

	render() {
		const { gridState } = this.state;
		console.log('gridState', gridState);
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