import React, { Component, MouseEvent } from 'react';
import Clue from './Clue';

import type {
  ClueState,
  Direction,
} from './types';

type Props = {
  clueState: ClueState,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLDivElement>, number: string, direction: Direction) => void,
};

export default class DownClues extends Component<Props> {
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
