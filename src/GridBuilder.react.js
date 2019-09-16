import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import Grid from './Grid.react.js';
import './GridBuilder.css';

export default function GridBuilder() {
	const [gridSize, setGridSize] = useState(9);
	const [tempSize, setTempSize] = useState(9);
	const [blanks, setBlanks] = useState(true);
	const [across, setAcross] = useState(true);

	const handleChange = (event) => {
		setTempSize(event.target.value);
  }

	const handleSubmit = (event) => {
		event.preventDefault();
		setGridSize(tempSize);
	}

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
		  <div>Input</div>
		  <div>
			  <input 
			  	type="radio" 
			  	id="blanks" 
			  	value="blanks" 
			  	onChange={() => {}}
			  	onClick={() => setBlanks(true)} 
			  	checked={blanks} 
		  	/>
			  <label><u>B</u>lanks</label>
			</div>
			<div>
			  <input 
			  	type="radio" 
			  	id="letters" 
			  	value="letters" 
			  	onChange={() => {}}
			  	onClick={() => setBlanks(false)} 
			  	checked={!blanks} 
			  />
			  <label><u>L</u>etters</label>
			</div>				
		  <div>Direction</div>
		  <div>
			  <input 
			  	type="radio" 
			  	id="across" 
			  	value="across" 
			  	onChange={() => {}}
			  	onClick={() => setAcross(true)} 
			  	checked={across} 
		  	/>
			  <label><u>A</u>cross</label>
			</div>
			<div>
			  <input 
			  	type="radio" 
			  	id="down" 
			  	value="down" 
			  	onChange={() => {}}
			  	onClick={() => setAcross(false)} 
			  	checked={!across} 
		  	/>
			  <label><u>D</u>own</label>
			</div>
		  <div ref={componentRef} className="printable">
		  	<textarea className="centerHeader title" defaultValue="My Crossword Puzzle" />
		  	<div className="centerTable">
    			<Grid 
    				size={gridSize} 
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