import React from 'react';
import {
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

		this.handleToggleBlank = this.handleToggleBlank.bind(this);
		this.handleLetterChange = this.handleLetterChange.bind(this);
		this.handleLetterClick = this.handleLetterClick.bind(this);
		this.handleNumberClick = this.handleNumberClick.bind(this);
	}

	handleToggleBlank(row, col) {
		const { gridSize, gridState, inputType, updateGrid } = this.props;
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
		// const numberedGrid = enumerate(gridCopy);
		updateGrid(gridCopy);
	}

	handleLetterClick(row, col) {
		const { direction, inputType, gridState, updateGrid } = this.props;
		if (inputType === 'blanks') {
			return;
		}
		const gridCopy = clearFocus(gridState);
		gridCopy[row][col].focused = true;
		const gridWithHighlight = highlightWord(row, col, gridCopy, direction);
		updateGrid(gridWithHighlight);
	}

	handleNumberClick(e, row, col) {
		e.stopPropagation();
		console.log('number click', row, col);
		// construct query from word / direction as X?X?X?
		// fetch possible answers
		// order alphabetically and de-dupe
		// show dropdown
	}

	handleLetterChange(row, col, val) {
		const { direction, inputType, gridState, updateGrid } = this.props;
		if (inputType === 'blanks') {
			return;
		}
		const gridCopy = clearFocus(gridState);
		gridCopy[row][col].focused = true;
		const newVal = val && val[0] && val[0].toUpperCase();
		gridCopy[row][col].value = newVal;
		if (newVal) {
			const gridWithFocus = advanceFocus(row, col, gridCopy, direction);
			const focusedCell = findFocus(gridWithFocus);
			if (!gridWithFocus[focusedCell.row][focusedCell.col].highlighted) {
				const gridWithHighlight = highlightWord(focusedCell.row, focusedCell.col, gridWithFocus, direction);
        updateGrid(gridWithHighlight);
			} else {
				updateGrid(gridWithFocus);
			}
		} else {
			updateGrid(gridCopy);
		}
	}

	render() {
		const { gridState, toggleDirection } = this.props;
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
			  						onNumberClick={this.handleNumberClick}
			  						onToggleBlank={this.handleToggleBlank}
			  						toggleDirection={toggleDirection}
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
