import React from 'react';

import AcrossClues from './AcrossClues.react';
import DownClues from './DownClues.react';
import './Clues.css';

export default function Clues({ gridState }) {
	return (
    <div className="contents">
      <AcrossClues gridState={gridState} />
      <DownClues gridState={gridState} />
    </div>
	);
}
