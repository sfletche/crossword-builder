import React from 'react';
import { withHotKeys } from "react-hotkeys";
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


class Grid extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gridSize: 0,
			gridState: null,
		};

		this.handleToggleBlank = this.handleToggleBlank.bind(this);
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
		const { clickType } = this.props;
		if (clickType === 'letters') {
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

	handleLetterChange(row, col, val) {
		const { gridState } = this.state;
		const { clickType } = this.props;
		if (clickType === 'blanks') {
			return;
		}
		const gridCopy = gridState.map(function(rowState) {
	    return rowState.slice();
		});
		gridCopy[row][col].value = val[0] && val[0].toUpperCase();
		const gridWithFocus = val[0] ? advanceFocus(row, col, gridCopy) : gridCopy;
		this.setState({ gridState: gridWithFocus });
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
			  						onLetterChange={this.handleLetterChange}
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

export default withHotKeys(Grid);