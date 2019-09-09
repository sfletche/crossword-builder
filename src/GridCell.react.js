import React from 'react';

import './GridCell.css';

export default function GridCell({ row, col, val, onToggleBlank }) {
	const className = val === 'BLANK' ? 'blank' : 'standard';
	return (
	  <div className={className} onClick={() => onToggleBlank(row, col)} />
	);
}