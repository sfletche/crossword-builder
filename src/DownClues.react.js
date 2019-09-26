import React from 'react';

export default function DownClues({ clueState, onClueUpdate }) {
	return (
		<div className="mt50">
      <h4 className="mb5">Down</h4>
      {Object.keys(clueState.down).map(key => (
        <div key={key}>
          <div className="rightJustify">
            {key}
          </div>
          <textarea
            className="clue"
            onChange={(e) => onClueUpdate(key, 'down', e.target.value)}
            value={clueState.down[key]}
          />
        </div>
      ))}
    </div>
	);
}
