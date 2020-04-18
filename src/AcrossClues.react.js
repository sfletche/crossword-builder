import React from 'react';
import Clue from './Clue.react';
import './AcrossClues.css';

export default class AcrossClues extends React.Component {
  render() {
    const { clueState, onClueUpdate, onNumberClick } = this.props;
  	return (
  		<div className="flex minw350 space-between">        
        <div className="fullWidth">
          <h4 className="mb5">Across</h4>
          {Object.keys(clueState.across).map(key => (
            <Clue
              key={key}
              number={key}
              direction="across"
              onNumberClick={onNumberClick}
              onClueUpdate={onClueUpdate}
              value={clueState.across[key]}
            />
          ))}        
        </div>
      </div>
  	);
  }
}

