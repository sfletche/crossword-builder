import React from 'react';

export default function InputButtons({ direction, onSetAcross, onSetDown }) {
	return (
		<div>
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
			  <label><u>A</u>cross</label>
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
			  <label><u>D</u>own</label>
			</div>
		</div>		
	);
}
			