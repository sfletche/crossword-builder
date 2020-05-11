import React, { ChangeEvent, MouseEvent } from 'react';
import { Input, SIZE } from 'baseui/input';

import './Clue.css';

import type {
  ClueState,
  Direction,
} from './types';


type Props = {
  number: string,
  direction: Direction,
  onClueUpdate: (number: string, direction: Direction, clue: string) => void,
  onNumberClick: (event: MouseEvent<HTMLSpanElement>, number: string, direction: Direction) => void,
  clue: ClueState,
};

export default function Clue(props: Props) {
  const {
    number,
    direction,
    onNumberClick,
    onClueUpdate,
    clue,
  } = props;
  const highlight = clue.highlighted ? 'highlight' : '';

  return (
    <div className="flex" key={number + direction}>      
      <Input
        key={number + direction}
        onChange={(e: ChangeEvent<HTMLInputElement>)  => onClueUpdate(number, direction, e.target.value)}
        onFocus={e => onClueUpdate(number, direction, e.target.value)}
        overrides={{
          StartEnhancer: {
            style: ({ $theme }) => ({
               fontSize: '16px',
               ':hover': {
                 cursor: 'pointer',
               },
            })
          }
        }}
        positive={clue.highlighted}
        size={SIZE.mini}
        startEnhancer={<span onClick={(e: MouseEvent<HTMLSpanElement>) => 
          onNumberClick(e, number, direction)}>{number}</span>}
        value={clue.clue}
      />
    </div>
  );
}
