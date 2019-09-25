import React from 'react';

import AcrossClues from './AcrossClues.react';
import DownClues from './DownClues.react';
import './Clues.css';

export default function Clues({ clueState, onClueUpdate }) {
	return (
    <div className="contents">
      <AcrossClues clueState={clueState} onClueUpdate={onClueUpdate} />
      <DownClues clueState={clueState} onClueUpdate={onClueUpdate} />
    </div>
	);
}
