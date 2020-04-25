
export type AcrossClues = { [key: string]: string };
export type DownClues = { [key: string]: string };
export type CellState = { row: number, col: number };
export type ClueState = { across: AcrossClues, down: DownClues };
export type Direction = 'across' | 'down';
export type ArrowDirection = 'left' | 'right' | 'up' | 'down';
export type RowState = Array<{ focused?: boolean, highlighted?: boolean, number: number, value: string }>;
export type GridState = Array<RowState>;
export type SimpleGrid = Array<Array<{ value: string }>>;
export type EnumeratedGrid = Array<Array<{ number: number, value: string }>>;
export type Cell = { row: number, col: number };
export type NextCell = { nextRow: number, nextCol: number };