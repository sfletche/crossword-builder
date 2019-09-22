import React from 'react';

export default function InputButtons({ className, inputType, onSetBlanks, onSetLetters }) {
	return (
		<div className={className}>
		  <div>Input</div>
		  <div>
			  <input 
			  	type="radio" 
			  	id="blanks" 
			  	value="blanks" 
			  	onChange={() => {}}
			  	onClick={onSetBlanks} 
			  	checked={inputType === 'blanks'} 
		  	/>
			  <label>Blanks</label>
			</div>
			<div>
			  <input 
			  	type="radio" 
			  	id="letters" 
			  	value="letters" 
			  	onChange={() => {}}
			  	onClick={onSetLetters} 
			  	checked={inputType === 'letters'} 
			  />
			  <label>Letters</label>
			</div>	
		</div>		
	);
}

		