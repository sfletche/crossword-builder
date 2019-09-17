import React from 'react';
import {
	getGrid,
	enumerate,
	clearFocus,
	advanceFocus,
	findFocus,
	highlightWord,
} from './utils/utils';
import GridCell from './GridCell.react';
import './Grid.css';


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