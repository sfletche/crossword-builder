
export type ClueState = { clue: string, highlighted: boolean };
export type AcrossClues = { [key: string]: ClueState };
export type DownClues = { [key: string]: ClueState };
export type CluesState = { across: AcrossClues, down: DownClues };

export type Direction = 'across' | 'down';
export type ArrowDirection = 'left' | 'right' | 'up' | 'down';

export type CellState = { row: number, col: number };
export type SimpleGrid = Array<Array<{ value: string }>>;
export type EnumeratedGrid = Array<Array<{ number: string, value: string }>>;
export type RowState = Array<{ focused?: boolean, highlighted?: boolean, number: string, value: string }>;
export type GridState = Array<RowState>;
