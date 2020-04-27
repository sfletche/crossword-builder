import React, { Component, MouseEvent } from 'react';
import Clue from './Clue';

import type {
  CluesState,
  Direction,
} from './types';

type Props = {
  cluesState: CluesState,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
};

export default class DownClues extends Component<Props> {
  render() {
    const { cluesState, onClueUpdate, onNumberClick } = this.props;
    return (
      <div className="flex minw350 space-between">
        <div className="fullWidth">
          <h4 className="mb5">Down</h4>
          {Object.keys(cluesState.down).map(key => (
            <Clue
              key={key}
              number={key}
              direction="down"
              onNumberClick={onNumberClick}
              onClueUpdate={onClueUpdate}
              clue={cluesState.down[key]}
            />
          ))}        
        </div>
      </div>
    );
  }
}
