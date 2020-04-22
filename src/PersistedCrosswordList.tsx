import React, { ReactElement } from 'react';

type AcrossClues = { [key: string]: string };
type DownClues = { [key: number]: string };
type ClueState = { across: AcrossClues, down: DownClues };
type RowState = Array<{ focused?: boolean, highlighted?: boolean, number: number, value: string }>;
type GridState = Array<RowState>;

type OnSelect = (title: string, gridState: GridState, clueState: ClueState) => void;
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
    acc: { [key: string]: { gridState: GridState, clueState: ClueState } }, 
    key: string,
  ) => {
    const data = JSON.parse(localStorage.getItem(key));
    return { ...acc, [data.title]: { gridState: data.gridState, clueState: data.clueState } };
  }, {});

  if (!Object.keys(crosswords).length) {
    return <span>No Persisted Crosswords...</span>;
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
}

export default function PersistedCrosswordList({ onSelect }: Props) {
	return (
		<div>
		  <h4>Previously Saved Crosswords</h4>
	  	{getCrosswords(onSelect)}
		</div>
	);
}

