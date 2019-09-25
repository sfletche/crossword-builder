import React from 'react';
import './InputButtons.css';

export default function InputButtons({ className, inputType, onSetBlanks, onSetLetters }) {
	return (
		<div className={className}>
		  <span>Input</span>
		  <span className="ml10">
			  <input
			  	type="radio"
			  	id="blanks"
			  	value="blanks"
			  	onChange={() => {}}
			  	onClick={onSetBlanks}
			  	checked={inputType === 'blanks'}
		  	/>
			  <label>Blanks</label>
			</span>
			<span className="ml10">
			  <input
			  	type="radio"
			  	id="letters"
			  	value="letters"
			  	onChange={() => {}}
			  	onClick={onSetLetters}
			  	checked={inputType === 'letters'}
			  />
			  <label>Letters</label>
			</span>
		</div>
	);
}
