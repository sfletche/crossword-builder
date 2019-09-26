import React from 'react';

export default function PersistedCrosswordList({ onSelect }) {
	const getCrosswords = () => {
		let savedKeys = localStorage.getItem('crosswordKeys');
		if (!savedKeys) {
			savedKeys = [];
			localStorage.setItem('crosswordKeys', JSON.stringify([]));
			return 'No Persisted Crosswords...';
		} else {
			savedKeys = JSON.parse(savedKeys);
		}
		const crosswords = savedKeys.reduce((acc, key) => {
  		const data = JSON.parse(localStorage.getItem(key));
  		return { ...acc, [data.title]: { gridState: data.gridState, clueState: data.clueState } };
  	}, {});

  	if (!Object.keys(crosswords).length) {
  		return 'No Persisted Crosswords...';
  	}

		return (
			<ul>
				{Object.keys(crosswords).map(title => (
					<li
            key={title}
            onClick={() => {
              const { gridState, clueState } = crosswords[title];
              onSelect(title, gridState, clueState);
            }}
          >
            {title}
          </li>
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

