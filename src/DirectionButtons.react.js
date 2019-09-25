import React from 'react';

export default function InputButtons({ className, direction, onSetAcross, onSetDown }) {
	return (
		<div className={className}>
		  <span>Direction</span>
		  <span className="ml10">
			  <input
			  	type="radio"
			  	id="across"
			  	value="across"
			  	onChange={() => {}}
			  	onClick={onSetAcross}
			  	checked={direction === 'across'}
		  	/>
			  <label>Across</label>
			</span>
			<span className="ml10">
			  <input
			  	type="radio"
			  	id="down"
			  	value="down"
			  	onChange={() => {}}
			  	onClick={onSetDown}
			  	checked={direction === 'down'}
		  	/>
			  <label>Down</label>
			</span>
		</div>
	);
}
