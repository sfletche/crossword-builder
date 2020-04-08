import React from 'react';

export default function Clue(props) {
  const {
    number,
    direction,
    onNumberClick,
    onClueUpdate,
    value,
  } = props;

  return (
    <div className="flex" key={number + direction}>
      <div 
        className="rightJustify"
        onClick={(e) => onNumberClick(e, number, direction)}
      >
        {number}:
      </div>
      <textarea
        className="clue"
        key={number + direction}
        onChange={(e) => onClueUpdate(number, direction, e.target.value)}
        value={value}
      />
    </div>
  );
}
