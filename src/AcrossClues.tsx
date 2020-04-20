import React, { Component, MouseEvent } from 'react';
import Clue from './Clue';
import './AcrossClues.css';

type ClueObject = { [key: string]: string };
type Clues = { across: ClueObject, down: ClueObject };
type Direction = 'across' | 'down';

type Props = {
  clueState: Clues,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
};

export default class AcrossClues extends Component<Props> {
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

