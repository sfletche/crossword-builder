import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import {
	enumerate,
} from './utils/utils';
import Grid from './Grid.react';
import InputButtons from './InputButtons.react';
import DirectionButtons from './DirectionButtons.react';
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
	};

	const handleSetLetters = () => {
		setBlanks(false);
	};

	const handleSetAcross = () => {
		setAcross(true);
	};

	const handleSetDown = () => {
		setAcross(false);
	};

	const componentRef = useRef();

  return ( 
    <div>	
	  	<form onSubmit={handleSubmit}>
	      <label>
	        Grid Size (how many rows):
	        <input type="text" value={tempSize} onChange={handleChange} />
	      </label>
	      <input type="submit" value="Submit" />
		  </form>
		  <InputButtons
		  	inputType={blanks ? 'blanks' : 'letters'}
		  	onSetBlanks={handleSetBlanks}
		  	onSetLetters={handleSetLetters}
		  />
		  <DirectionButtons
		  	direction={across ? 'across' : 'down'}
		  	onSetAcross={handleSetAcross}
		  	onSetDown={handleSetDown}
		  />		  
		  <div ref={componentRef} className="printable">
		  	<textarea className="centerHeader title" defaultValue="My Crossword Puzzle" />
		  	<div className="centerTable">
    			<Grid 
    				gridSize={gridSize} 
    				gridState={gridState}
    				updateGrid={handleGridUpdate}
    				inputType={blanks ? 'blanks' : 'letters'} 
    				direction={across ? 'across' : 'down'}
  				/>
    		</div>
    	</div>
    	<div className="mt20">
	      <ReactToPrint
	        trigger={() => <a href="#">Print crossword</a>}
	        content={() => componentRef.current}
	      />
	    </div>
	  </div>
  );
}