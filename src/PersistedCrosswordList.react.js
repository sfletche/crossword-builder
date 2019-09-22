import React from 'react';

export default function PersistedCrosswordList({ onSelect }) {	
	const getCrosswords = () => {
		localStorage.clear();
		let savedKeys = localStorage.getItem('crosswordKeys');
		if (!savedKeys) {
			savedKeys = [];
			localStorage.setItem('crosswordKeys', JSON.stringify([]));
			return;
		} else {
			savedKeys = JSON.parse(savedKeys);
		}
		const crosswords = savedKeys.reduce((acc, key) => {
  		const data = JSON.parse(localStorage.getItem(key));
  		return { ...acc, [data.title]: data.gridState };
  	}, {});

  	if (!Object.keys(crosswords).length) {
  		return 'No Persisted Crosswords...';
  	}
		
		return (
			<ul>
				{Object.keys(crosswords).map(title => (
					<li onClick={() => onSelect(title, crosswords[title])}>{title}</li>
				))}
			</ul>
		);
	};

	return (
		<div>
		  <h4>Previously Saved Crosswords</h4>
	  	{getCrosswords()}
		</div>		
	);
}

		