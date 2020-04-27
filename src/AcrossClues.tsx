import React, { Component, MouseEvent } from 'react';
import Clue from './Clue';
import './AcrossClues.css';

import type {
  CluesState,
  Direction,
} from './types';

type Props = {
  cluesState: CluesState,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
};

export default class AcrossClues extends Component<Props> {
  render() {
    const { cluesState, onClueUpdate, onNumberClick } = this.props;
  	return (
  		<div className="flex minw350 space-between">        
        <div className="fullWidth">
          <h4 className="mb5">Across</h4>
          {Object.keys(cluesState.across).map(key => (
            <Clue
              key={key}
              number={key}
              direction="across"
              onNumberClick={onNumberClick}
              onClueUpdate={onClueUpdate}
              clue={cluesState.across[key]}
            />
          ))}        
        </div>
      </div>
  	);
  }
}

