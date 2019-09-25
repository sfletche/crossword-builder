import React from 'react';
import './AcrossClues.css';

export default function AcrossClues({ clueState, onClueUpdate }) {
	return (
		<div className="mt50">
      <h4 className="mb5">Across</h4>
      {clueState.across.map(clue => (
        <div key={clue}>
          <div className="rightJustify">
            {clue}
          </div>
          <textarea className="clue"/>
        </div>
      ))}
    </div>
	);
}

