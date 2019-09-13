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


export default class Grid extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			gridSize: 0,
			gridState: null,
		};

		this.handleToggleBlank = this.handleToggleBlank.bind(this);
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
	}

	handleToggleBlank(row, col) {
		const { gridSize, gridState } = this.state;
		const gridCopy = [...gridState];
		if(gridCopy[row][col].value === 'BLANK') {
			gridCopy[row][col].value = '';
			gridCopy[gridSize - row - 1][gridSize - col - 1].value = '';
		} else {
			gridCopy[row][col].value = 'BLANK';
			gridCopy[gridSize - row - 1][gridSize - col - 1].value = 'BLANK';
		}
		const numberedGrid = enumerate(gridCopy);
		this.setState({ gridState: gridCopy });
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