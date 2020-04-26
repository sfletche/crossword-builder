import { 
  colToRightIsBlank, 
  findCellFromNumber,
  rowBelowIsBlank,
} from './utils';

import type {
  Direction,
  GridState,
} from '../types';

function getAnswerAcross(number: string, grid: GridState): string {
  const { row, col } = findCellFromNumber(grid, number);
  let nextCol = col;
  let answer = grid[row][col].value;
  while(!colToRightIsBlank(row, nextCol++, grid)) {
    answer += grid[row][nextCol].value;
  }
  return answer;
}

function getAnswerDown(number: string, grid: GridState): string {
  const { row, col } = findCellFromNumber(grid, number);
  let nextRow = row;
  let answer = grid[row][col].value;
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    answer += grid[nextRow][col].value;
  }
  return answer;
}

function getAnswer(number: string, direction: Direction, grid: GridState): string {
  if (direction === 'across') {
    return getAnswerAcross(number, grid);
  }
  return getAnswerDown(number, grid);
}

export async function fetchClues(number: string, direction: Direction, gridState: GridState): Promise<Array<string>> {
  const answer = getAnswer(number, direction, gridState);
  console.log('answer', answer);
  const url = 'https://search-crossword-yq7gx54qazz4o5mrpmbrqhuoc4.us-east-2.es.amazonaws.com/_search';
  const queryParam = '?q=answer:' + answer;
  const resp = await fetch(url + queryParam);
  const jsonData = await resp.json();
  console.log("jsonData: ", jsonData);
  if (jsonData.error && jsonData.status >= 400) {
    return [];
  }
  const { hits } = jsonData.hits;
  const clues = hits.length && hits[0]._source.clues;
  return clues || [];
}
