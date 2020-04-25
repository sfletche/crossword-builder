import React, { KeyboardEvent, MouseEvent, useEffect, useRef } from 'react';

import './GridCell.css';

type Props = {
  col: number,
  focused: boolean,
  highlighted: boolean,
  number: number,
  onKeyAction: (row: number, col: number, event: KeyboardEvent<HTMLDivElement>) => void,
  onLetterClick: (row: number, col: number) => void,
  onNumberClick: (event: MouseEvent<HTMLSpanElement>, row: number, col: number) => void,
  onToggleBlank: (row: number, col: number) => void,
  puzzleHasFocus: boolean,
  row: number,
  value: string,
};


export default function GridCell(props: Props) {
	const {
		col,
		focused,
		highlighted,
		number,
    onKeyAction,
		onLetterClick,
    onNumberClick,
		onToggleBlank,
    puzzleHasFocus,
		row,
		value,
	} = props;

  const componentRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (puzzleHasFocus && focused) {
    	componentRef.current.focus();
    }
  });
  
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
