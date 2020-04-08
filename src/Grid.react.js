import React from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {
	clearFocus,
	colToRightIsBlank,
	advanceFocus,
	findCellFromNumber,
	findFocus,
	highlightWord,
	rowBelowIsBlank,
	stepFocus,
} from './utils/utils';
import { fetchAnswers } from './utils';
import GridCell from './GridCell.react';
import './Grid.css';


function setAnswerAcross(row, col, grid, answer) {
	const gridCopy = [...grid];
	let i = 0;
	gridCopy[row][col].value = answer[i++];
	let nextCol = col;
	while(!colToRightIsBlank(row, nextCol++, grid) && i < answer.length) {
		gridCopy[row][nextCol].value = answer[i++];
	}
	return gridCopy;
}

function setAnswerDown(row, col, grid, answer) {
	const gridCopy = [...grid];
	let i = 0;
	gridCopy[row][col].value = answer[i++];
	let nextRow = row;
	while(!rowBelowIsBlank(nextRow++, col, grid)) {
		gridCopy[nextRow][col].value = answer[i++];
	}
	return gridCopy;
}

function getGridWithAnswer(gridState, answer, answerNumber, answerDirection) {
	const { row, col } = findCellFromNumber(gridState, answerNumber);
	let gridWithAnswer;
	if (answerDirection === 'across') {
		gridWithAnswer = setAnswerAcross(row, col, gridState, answer);
	} else {
		gridWithAnswer = setAnswerDown(row, col, gridState, answer);
	}
	return gridWithAnswer;
}

export default class Grid extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			answers: [],
			answerDirection: props.direction,
			answerNumber: null,
		}

		this.handleAnswerSelect = this.handleAnswerSelect.bind(this);
		this.handleKeyAction = this.handleKeyAction.bind(this);
		this.handleLetterChange = this.handleLetterChange.bind(this);
		this.handleLetterClick = this.handleLetterClick.bind(this);
		this.handleNumberClick = this.handleNumberClick.bind(this);
		this.handleToggleBlank = this.handleToggleBlank.bind(this);
		this.setGridAnswer = this.setGridAnswer.bind(this);
	}

	handleToggleBlank(row, col) {
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

	handleLetterClick(row, col) {
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
	}

	async handleNumberClick(e, row, col) {
		const { direction, gridState } = this.props;
		e.stopPropagation();
		const answers = await fetchAnswers(row, col, direction, gridState);
		// TODO: order alphabetically and de-dupe
		this.setState({ 
			answers, 
			answerDirection: direction,
			answerNumber: gridState[row][col].number,
			showDropdown: true,
		});
	}

	setGridAnswer(answer) {
		const { gridState, onGridUpdate } = this.props;
		const { answerNumber, answerDirection } = this.state;
		const gridCopy = [...gridState];
		const gridWithAnswer = getGridWithAnswer(gridCopy, answer, answerNumber, answerDirection);
		onGridUpdate(gridWithAnswer);
	}

	handleAnswerSelect(answer) {
		this.setGridAnswer(answer.value);
		this.setState({
			answers: [],
			showDropdown: false,
		});
	}

	handleKeyAction(row, col, event) {
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
	}

	handleLetterChange(row, col, val) {
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
		const { gridState, puzzleHasFocus } = this.props;
		const { answers, showDropdown } = this.state;
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
				  						onNumberClick={this.handleNumberClick}
				  						onToggleBlank={this.handleToggleBlank}
				  						puzzleHasFocus={puzzleHasFocus}
			  						/>
				  				</td>
				  			)}
			  			</tr>
						)}
					</tbody>
			  </table>
			  {showDropdown && 
			  	<Dropdown 
			  		className="dropdown"
			  		menuClassName="dropdownMenu"
			  		onChange={this.handleAnswerSelect} 
			  		options={answers} 
			  		placeholder="Select an answer" 
		  		/>
			  }
			</div>		
		);
	}
}
