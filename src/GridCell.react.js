import React, { useEffect, useRef } from 'react';

import './GridCell.css';

export default function GridCell(props) {
	const { 
		row, 
		col, 
		value, 
		number, 
		focused, 
		highlighted,
		onLetterChange,
		onLetterClick,
		onToggleBlank, 
	} = props;
  useEffect(() => {
    if (focused) { 
    	componentRef.current.focus(); 
    }
  });
  const componentRef = useRef();
	let outerDivClass = value === 'BLANK' ? 'blank' : 'standard';
	if (highlighted) {
		outerDivClass += ' highlighted';
	}
	const innerDivClass = number ? 'letterWithNumber' : 'letter';
	const letterValue = value === 'BLANK' ? null : value;
	return (
	  <div className={outerDivClass} onClick={() => onToggleBlank(row, col)}>
	  	<div className="number">
	  		{number} 
	  		<div 
	  			contentEditable
	  			className={innerDivClass} 
	  			onClick={event => onLetterClick(row, col)}
	  			onDoubleClick={() => alert('howdy')}
	  			onInput={event => onLetterChange(row, col, event.currentTarget.textContent)}
	  			ref={componentRef}	  			
  			>
  				{letterValue}
  			</div>
	  	</div>
	  </div>	
	);
}