import React, { Component, KeyboardEvent, MouseEvent } from 'react';
import 'react-dropdown/style.css';
import {
	clearFocus,
	advanceFocus,
	findFocus,
	highlightWord,
	stepFocus,
} from './utils/utils';
import GridCell from './GridCell';
import './Grid.css';

type Direction = 'across' | 'down';
type Row = Array<{ focused?: boolean, highlighted?: boolean, number: number, value: string }>;
type GridState = Array<Row>;

type Props = {
	direction: Direction
	gridSize: number, 
	gridState: GridState, 
	inputType: string, 
	onDirectionToggle: (grid: GridState) => void,
	onGridUpdate: (grid: GridState) => void,
	onNumberClick: (event: MouseEvent<HTMLSpanElement>, row: number, col: number) => void,
	onSetAcross: (grid: GridState) => void,
	onSetDown: (grid: GridState) => void,
	puzzleHasFocus: boolean,
}

export default class Grid extends Component<Props> {
	constructor(props: Props) {
		super(props);

		this.handleKeyAction = this.handleKeyAction.bind(this);
		this.handleLetterChange = this.handleLetterChange.bind(this);
		this.handleLetterClick = this.handleLetterClick.bind(this);
		this.handleToggleBlank = this.handleToggleBlank.bind(this);
	}

	handleToggleBlank(row: number, col: number) {
		const { gridSize, gridState, inputType, onGridUpdate } = this.props;
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
		onGridUpdate(gridCopy);
	}

	handleLetterClick(row: number, col: number) {
		const { 
			direction, 
			gridState, 
			inputType, 
			onDirectionToggle, 
			onGridUpdate, 
			onSetAcross,
			onSetDown,
		} = this.props;
		if (inputType === 'blanks') {
			return;
		}
		const focusedCell = findFocus(gridState);
		if (focusedCell.row === row && focusedCell.col === col) {
			onDirectionToggle(gridState);
			return;
		}
		const gridCopy = clearFocus(gridState);
		gridCopy[row][col].focused = true;
		onGridUpdate(gridCopy);
		if (direction === 'across') {
			onSetAcross(gridCopy);
		} else {
			onSetDown(gridCopy);
		}
		this.setState({ showDropdown: false });
	}

	handleKeyAction(row: number, col: number, event: KeyboardEvent<HTMLDivElement>) {
		event.preventDefault();
		const { gridState, onSetAcross, onSetDown } = this.props;
		const { keyCode } = event;
		if (keyCode === 37) {
  		onSetAcross(stepFocus(row, col, gridState, 'left'))
	  } else if (keyCode === 38) {
  		onSetDown(stepFocus(row, col, gridState, 'up'));
	  } else if (keyCode === 39) {
  		onSetAcross(stepFocus(row, col, gridState, 'right'))
	  } else if (keyCode === 40) {
  		onSetDown(stepFocus(row, col, gridState, 'down'));
	  } else {
     	if (event.keyCode >= 65 && event.keyCode <= 90) {
     	  this.handleLetterChange(row, col, String.fromCharCode(event.keyCode).toUpperCase());
     	} else if ([46, 8, 32].includes(event.keyCode)) {
     		this.handleLetterChange(row, col, '');
     	}
		}
		this.setState({ showDropdown: false });
	}

	handleLetterChange(row: number, col: number, val: string) {
		const { direction, inputType, gridState, onGridUpdate } = this.props;
		if (inputType === 'blanks') {
			return;
		}
		const gridCopy = clearFocus(gridState);
		gridCopy[row][col].focused = true;
		gridCopy[row][col].value = val;
		if (val) {
			const gridWithFocus = advanceFocus(row, col, gridCopy, direction);
			const focusedCell = findFocus(gridWithFocus);
			if (!gridWithFocus[focusedCell.row][focusedCell.col].highlighted) {
				const gridWithHighlight = highlightWord(focusedCell.row, focusedCell.col, gridWithFocus, direction);
        onGridUpdate(gridWithHighlight);
			} else {
				onGridUpdate(gridWithFocus);
			}
		} else {
			onGridUpdate(gridCopy);
		}
	}

	render() {
		const { gridState, onNumberClick, puzzleHasFocus } = this.props;
		return gridState && (
			<div className="flex">
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
				  						onKeyAction={this.handleKeyAction}
				  						onLetterClick={this.handleLetterClick}
				  						onNumberClick={onNumberClick}
				  						onToggleBlank={this.handleToggleBlank}
				  						puzzleHasFocus={puzzleHasFocus}
			  						/>
				  				</td>
				  			)}
			  			</tr>
						)}
					</tbody>
			  </table>
			</div>		
		);
	}
}
