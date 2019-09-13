import React from 'react';

import './GridCell.css';

export default function GridCell({ row, col, value, number, onToggleBlank }) {
	const className = value === 'BLANK' ? 'blank' : 'standard';
	return (
	  <div className={className} onClick={() => onToggleBlank(row, col)}>
	  	<div className="number">
	  		{number} 
	  	</div>
	  </div>	
	);
}