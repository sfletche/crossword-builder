import React from 'react';

export default function InputButtons({ inputType, onSetBlanks, onSetLetters }) {
	return (
		<div>
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
			  <label><u>B</u>lanks</label>
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
			  <label><u>L</u>etters</label>
			</div>	
		</div>		
	);
}

		