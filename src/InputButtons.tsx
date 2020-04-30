import React from 'react';
import { RadioGroup, Radio, ALIGN } from "baseui/radio";
import './InputButtons.css';

type Props = {
	className: string,
	inputType: 'blanks' | 'letters',
	onSetBlanks: () => void,
	onSetLetters: () => void,
};

export default function InputButtons({ className, inputType, onSetBlanks, onSetLetters }: Props) {
	const onChange = (value: string) => { value === 'blanks' ? onSetBlanks() : onSetLetters(); };

	return (
		<div className={className}>
			<RadioGroup	
				align={ALIGN.horizontal}
				name="Input"
				onChange={e => onChange(e.target.value)}
				value={inputType}
			>
				<Radio value="blanks">Blanks</Radio>
				<Radio value="letters">Letters</Radio>
			</RadioGroup>		  
		</div>
	);
}
