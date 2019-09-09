import React, { useState } from 'react';
import Grid from './Grid.react.js';

export default function GridBuilder() {
	const [gridSize, setGridSize] = useState(4);
	const [tempSize, setTempSize] = useState(4);

	const handleChange = (event) => {
	  console.log('handleChange', event.target.value)
		setTempSize(event.target.value);
  }

	const handleSubmit = (event) => {
	  console.log('handleSubmit')
		event.preventDefault();
		setGridSize(tempSize);
	}

  return (  
    <div>	
	  	<form onSubmit={handleSubmit}>
	      <label>
	        Grid Size (how many rows):
	        <input type="text" value={tempSize} onChange={handleChange} />
	      </label>
	      <input type="submit" value="Submit" />
		  </form>
	    {gridSize && <Grid size={gridSize} />}
	  </div>
  );
}