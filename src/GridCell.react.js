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
    onKeyAction,
		onLetterClick,
    onNumberClick,
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
	  		<span className="numberHover" onClick={(e) => onNumberClick(e, row, col)}>{number}</span>
	  		<div
	  			contentEditable
	  			className={innerDivClass}
	  			onClick={event => onLetterClick(row, col)}
	  			onFocus={e => window.getSelection().selectAllChildren(componentRef.current)}
          onKeyDown={event => onKeyAction(row, col, event)}
	  			ref={componentRef}
	  			suppressContentEditableWarning
  			>
  				{letterValue}
  			</div>
	  	</div>
	  </div>
	);
}
