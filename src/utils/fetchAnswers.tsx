import { colToRightIsBlank, rowBelowIsBlank } from './utils';

import type {
  Direction,
  GridState,
} from '../types';

type Hit = { _source: { answer: string } };

function getQueryAcross(row: number, col: number, grid: GridState): string {
  let nextCol = col;
  let query = grid[row][col].value || '?';
  while(!colToRightIsBlank(row, nextCol++, grid)) {
    query += grid[row][nextCol].value || '?';
  }
  return query;
}

function getQueryDown(row: number, col: number, grid: GridState): string {
  let nextRow = row;
  let query = grid[row][col].value || '?';
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    query += grid[nextRow][col].value || '?';
  }
  return query;
}

function getQuery(row: number, col: number, direction: Direction, grid: GridState): string {
  if (direction === 'across') {
    return getQueryAcross(row, col, grid);
  }
  return getQueryDown(row, col, grid);
}

export async function fetchAnswers(
  row: number, 
  col: number, 
  direction: Direction, 
  gridState: GridState,
): Promise<Array<string>> {
  const query = getQuery(row, col, direction, gridState);
  const url = 'https://search-crossword-yq7gx54qazz4o5mrpmbrqhuoc4.us-east-2.es.amazonaws.com/_search';
  const queryParam = '?q=answer:' + query + `&size=50`;
  const resp = await fetch(url + queryParam);
  const jsonData = await resp.json();
  if (jsonData.error && jsonData.status >= 400) {
    return [];
  }
  const answers = jsonData.hits.hits.map((hit: Hit) => hit._source.answer);
  return answers;
}