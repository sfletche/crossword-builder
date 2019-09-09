import React from 'react';
import GridCell from './GridCell.react';
import './Grid.css';


function getGrid(size) {
	console.log('getGrid with size', size)
	const grid = Array.from({length: size}, e => Array.from({length: size}, e => ''));
	console.log('grid', grid);
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
		const gridState = getGrid(gridSize);
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
		if(gridCopy[row][col] === 'BLANK') {
			gridCopy[row][col] = '';
			gridCopy[gridSize - row - 1][gridSize - col - 1] = '';
		} else {
			gridCopy[row][col] = 'BLANK';
			gridCopy[gridSize - row - 1][gridSize - col - 1] = 'BLANK';
		}
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
			  						val={gridState[row][col]} 
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