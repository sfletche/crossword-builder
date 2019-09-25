import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import {
	clearHighlights,
  colToLeftIsBlank,
  colToRightIsBlank,
	enumerate,
	findFocus,
	highlightWordAcross,
	highlightWordDown,
  rowAboveIsBlank,
  rowBelowIsBlank,
	slugify,
} from './utils/utils';
import Grid from './Grid.react';
import InputButtons from './InputButtons.react';
import DirectionButtons from './DirectionButtons.react';
import PersistedCrosswordList from './PersistedCrosswordList.react';
import './GridBuilder.css';

const INIT_SIZE = 9;

function getGrid(size) {
	return Array.from({length: size}, e => Array.from({length: size}, e => ({ value: '' })));
}

function initializeGrid() {
	return enumerate(getGrid(INIT_SIZE));
}

function getAcrossCluesFromRow(grid, gridRow, row) {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (colToLeftIsBlank(row, col, grid) && !colToRightIsBlank(row, col, grid)) {
      return [...acc, grid[row][col].number];
    }
    return acc;
  }, []);
}

function getAcrossClues(grid) {
  return grid.map((gridRow, row) => getAcrossCluesFromRow(grid, gridRow, row)).flat().join(', ');
}

function getDownCluesFromRow(grid, gridRow, row) {
  return gridRow.reduce((acc, cell, col) => {
    if (grid[row][col].value === 'BLANK') {
      return acc;
    }
    if (rowAboveIsBlank(row, col, grid) && !rowBelowIsBlank(row, col, grid)) {
      return [...acc, grid[row][col].number];
    }
    return acc;
  }, []);
}

function getDownClues(grid) {
  return grid.map((gridRow, row) => getDownCluesFromRow(grid, gridRow, row)).flat().join(', ');
}

export default function GridBuilder() {
	const [gridSize, setGridSize] = useState(INIT_SIZE);
	const [gridState, setGridState] = useState(initializeGrid());
	const [tempSize, setTempSize] = useState(INIT_SIZE);
	const [blanks, setBlanks] = useState(true);
	const [across, setAcross] = useState(true);
	const [title, updateTitle] = useState("My Crossword Puzzle");

	const handleChange = (event) => {
		setTempSize(event.target.value);
  };

	const handleSubmit = (event) => {
		event.preventDefault();
		setGridSize(tempSize);
		const grid = getGrid(tempSize);
		const enumeratedGrid = enumerate(grid);
		setGridState(enumeratedGrid);
	};

	const handleGridUpdate = (grid) => {
		setGridState(enumerate(grid));
	};

	const handleSetBlanks = () => {
		setBlanks(true);
		const gridWithoutHighlights = clearHighlights(gridState);
		setGridState(gridWithoutHighlights);
	};

	const handleSetLetters = () => {
		setBlanks(false);
	};

	const handleSetAcross = () => {
		setAcross(true);
		const focusedCell = findFocus(gridState);
		const highlightedGrid = highlightWordAcross(focusedCell.row, focusedCell.col, gridState);
		setGridState(highlightedGrid);
	};

	const handleSetDown = () => {
		setAcross(false);
		const focusedCell = findFocus(gridState);
		const highlightedGrid = highlightWordDown(focusedCell.row, focusedCell.col, gridState);
		setGridState(highlightedGrid);
	};

	const handleDirectionToggle = () => {
	  across ? handleSetDown() : handleSetAcross();
	};

	const handleOpenCrossword = (newTitle, newState) => {
		updateTitle(newTitle);
		setGridState(newState);
	};

	const saveCrossword = () => {
		const slug = slugify(title);
		const currentKeys = JSON.parse(localStorage.getItem('crosswordKeys'));
		if (!currentKeys.includes(slug)) {
			localStorage.setItem('crosswordKeys', JSON.stringify([...currentKeys, slug]));
		}
		localStorage.setItem(slug, JSON.stringify({ title, gridState }));
	};

	const componentRef = useRef();
  console.log('gridState', gridState);

  return (
    <div className="ml20">
	  	<form onSubmit={handleSubmit}>
	      <label>
	        Grid Size (how many rows):
	        <input type="text" value={tempSize} onChange={handleChange} />
	      </label>
	      <input type="submit" value="Submit" />
		  </form>
		  <InputButtons
		  	className="mt20"
		  	inputType={blanks ? 'blanks' : 'letters'}
		  	onSetBlanks={handleSetBlanks}
		  	onSetLetters={handleSetLetters}
		  />
		  <DirectionButtons
		  	className="mt20"
		  	direction={across ? 'across' : 'down'}
		  	onSetAcross={handleSetAcross}
		  	onSetDown={handleSetDown}
		  />
		  <div ref={componentRef} className="printable">
        <div className="clues">
          <div>
            <h4>Across</h4>
            {getAcrossClues(gridState)}
          </div>
          <div>
            <h4>Down</h4>
            {getDownClues(gridState)}
          </div>
        </div>
        <div className="puzzle">
  		  	<textarea
  		  		className="centerHeader title"
  		  		onChange={(e) => updateTitle(e.target.value)}
  		  		value={title}
  		  	/>
  		  	<div className="centerTable">
      			<Grid
      				direction={across ? 'across' : 'down'}
      				gridSize={gridSize}
      				gridState={gridState}
      				inputType={blanks ? 'blanks' : 'letters'}
      				toggleDirection={handleDirectionToggle}
      				updateGrid={handleGridUpdate}
    				/>
      		</div>
        </div>
    	</div>
    	<div className="mt20">
	      <ReactToPrint
	        content={() => componentRef.current}
	        trigger={() => <a href="#">Print Crossword</a>}
	      />
	    </div>
	    <div className="mt20">
	    	<a href="#" onClick={saveCrossword}>Save Crossword</a>
	    </div>
	    <div className="mt20">
	    	<PersistedCrosswordList
	    		onSelect={handleOpenCrossword}
	    	/>
	    </div>
	  </div>
  );
}