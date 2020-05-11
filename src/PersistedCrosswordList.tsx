import React, { ReactElement } from 'react';

import type {
  CluesState,
  GridState,
} from './types';

type OnSelect = (title: string, gridState: GridState, cluesState: CluesState) => void;
type Props = {
  onSelect: OnSelect,
};

function getCrosswords(onSelect: OnSelect): ReactElement {
  const savedKeys = localStorage.getItem('crosswordKeys');
  let parsedKeys;
  if (!savedKeys) {
    parsedKeys = [];
    localStorage.setItem('crosswordKeys', JSON.stringify([]));
    return <span>No Persisted Crosswords...</span>;
  } else {
    parsedKeys = JSON.parse(savedKeys);
  }
  const crosswords = parsedKeys.reduce((
    acc: { [key: string]: { gridState: GridState, cluesState: CluesState } }, 
    key: string,
  ) => {
    const data = JSON.parse(localStorage.getItem(key));
    return { ...acc, [data.title]: { gridState: data.gridState, cluesState: data.cluesState } };
  }, {});

  if (!Object.keys(crosswords).length) {
    return <span>No Persisted Crosswords...</span>;
  }

  return (
    <ul>
      {Object.keys(crosswords).map(title => (
        <li
          className="hoverable"
          key={title}
          onClick={() => {
            const { gridState, cluesState } = crosswords[title];
            onSelect(title, gridState, cluesState);
          }}
        >
          {title}
        </li>
      ))}
    </ul>
  );
}

export default function PersistedCrosswordList({ onSelect }: Props) {
	return (
		<div>
		  <h4>Previously Saved Crosswords</h4>
	  	{getCrosswords(onSelect)}
		</div>
	);
}

