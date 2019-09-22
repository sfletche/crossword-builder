import React from 'react';

export default function InputButtons({ className, direction, onSetAcross, onSetDown }) {
	return (
		<div className={className}>
		  <div>Direction</div>
		  <div>
			  <input 
			  	type="radio" 
			  	id="across" 
			  	value="across" 
			  	onChange={() => {}}
			  	onClick={onSetAcross} 
			  	checked={direction === 'across'} 
		  	/>
			  <label>Across</label>
			</div>
			<div>
			  <input 
			  	type="radio" 
			  	id="down" 
			  	value="down" 
			  	onChange={() => {}}
			  	onClick={onSetDown} 
			  	checked={direction === 'down'} 
		  	/>
			  <label>Down</label>
			</div>
		</div>		
	);
}
			