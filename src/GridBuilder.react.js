import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import Grid from './Grid.react.js';
import './GridBuilder.css';

export default function GridBuilder() {
	const [gridSize, setGridSize] = useState(9);
	const [tempSize, setTempSize] = useState(9);

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
		  <div ref={componentRef} className="printable">
		  	<textarea className="centerHeader title">My Crossword Puzzle</textarea>
		  	<div className="centerTable">
    			<Grid size={gridSize} />
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