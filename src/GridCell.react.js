import React from 'react';

import './GridCell.css';

export default function GridCell({ row, col, value, number, onToggleBlank, onLetterChange }) {
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
  			>
	  			{value === 'BLANK' ? null : value}
  			</div>
	  	</div>
	  </div>	
	);
}