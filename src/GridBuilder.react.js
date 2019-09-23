import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import {
	clearHighlights,
	enumerate,
	findFocus,
	highlightWordAcross,
	highlightWordDown,
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