import React from 'react';
import './AcrossClues.css';

export default function AcrossClues({ clueState, onClueUpdate }) {
	return (
		<div className="mt50">
      <h4 className="mb5">Across</h4>
      {Object.keys(clueState.across).map(key => (
        <div key={key + 'across'}>
          <div className="rightJustify">
            {key}
          </div>
          <textarea
            className="clue"
            key={key + 'across'}
            onChange={(e) => onClueUpdate(key, 'across', e.target.value)}
            value={clueState.across[key]}
          />
        </div>
      ))}
    </div>
	);
}

