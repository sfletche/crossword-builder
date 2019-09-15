import React, { useEffect, useRef, useState } from 'react';

import './GridCell.css';

export default function GridCell({ row, col, value, number, focused, onToggleBlank, onLetterChange }) {
	const [input, setInput] = useState(null);

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
	  			contenteditable="true" 
	  			className={letter} 
	  			onInput={e => onLetterChange(row, col, e.currentTarget.textContent)}
	  			ref={componentRef}
  			>
	  			{value === 'BLANK' ? null : value}
  			</div>
	  	</div>
	  </div>	
	);
}