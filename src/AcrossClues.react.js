import React from 'react';
import Clue from './Clue.react';
import './AcrossClues.css';

// function setClue(clueState, clue, number, direction) {
//   return {
//     ...clueState,
//     [direction]: {
//       ...clueState[direction],
//       [number]: clue,
//     },
//   }
// }

// function getCluesWithSelection(clueState, clue, number, direction) {
//   let cluesWithSelection;
//   console.log('clueState', clueState)
//   cluesWithSelection = setClue(clueState, clue, number, direction);
//   console.log('cluesWithSelection', cluesWithSelection)
//   return cluesWithSelection;
//   // return clueState;
// }

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
              value={clueState.down[key]}
            />
          ))}        
        </div>
      </div>
  	);
  }
}

