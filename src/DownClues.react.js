import React from 'react';

export default function DownClues({ clueState, onClueUpdate }) {
	return (
		<div className="mt50">
      <h4 className="mb5">Down</h4>
      {clueState.down.map(clue => (
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
