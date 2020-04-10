import React from 'react';
import Clue from './Clue.react';


export default class DownClues extends React.Component {
  render() {
    const { clueState, onClueUpdate, onNumberClick } = this.props;
    return (
      <div className="flex minw350 space-between">
        <div className="fullWidth">
          <h4 className="mb5">Down</h4>
          {Object.keys(clueState.down).map(key => (
            <Clue
              key={key}
              number={key}
              direction="down"
              onNumberClick={onNumberClick}
              onClueUpdate={onClueUpdate}
              value={clueState.down[key]}
            />
          ))}        
        </div>
      </div>
    );
  }
}
