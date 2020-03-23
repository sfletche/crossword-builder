import React from 'react';

import AcrossClues from './AcrossClues.react';
import DownClues from './DownClues.react';
import './Clues.css';

export default function Clues({ clueState, gridState, onClueUpdate }) {
	return (
    <div className="contents">
      <AcrossClues clueState={clueState} gridState={gridState} onClueUpdate={onClueUpdate} />
      <DownClues clueState={clueState} gridState={gridState} onClueUpdate={onClueUpdate} />
    </div>
	);
}
