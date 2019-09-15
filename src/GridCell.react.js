import React, { useEffect, useRef } from 'react';

import './GridCell.css';

export default function GridCell({ row, col, value, number, focused, onToggleBlank, onLetterChange }) {
  useEffect(() => {
    if (focused) { 
    	componentRef.current.focus(); 
    }
  });
  const componentRef = useRef();
	const blankOrNot = value === 'BLANK' ? 'blank' : 'standard';
	const letter = number ? 'letterWithNumber' : 'letter';
	return (
	  <div className={blankOrNot} onClick={() => onToggleBlank(row, col)}>
	  	<div className="number">
	  		{number} 
	  		<div 
	  			contentEditable
	  			className={letter} 
	  			onInput={event => onLetterChange(row, col, event.currentTarget.textContent)}
	  			ref={componentRef}	  			
  			>
  				{value === 'BLANK' ? null : value}
  			</div>
	  	</div>
	  </div>	
	);
}