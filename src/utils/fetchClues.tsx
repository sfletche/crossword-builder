import { 
  colToRightIsBlank, 
  findCellFromNumber,
  rowBelowIsBlank,
} from './utils';

type Direction = 'across' | 'down';
type Row = Array<{ focused?: boolean, number: number, value: string }>;
type Grid = Array<Row>;

function getAnswerAcross(number: number, grid: Grid): string {
  const { row, col } = findCellFromNumber(grid, number);
  let nextCol = col;
  let answer = grid[row][col].value;
  while(!colToRightIsBlank(row, nextCol++, grid)) {
    answer += grid[row][nextCol].value;
  }
  return answer;
}

function getAnswerDown(number: number, grid: Grid): string {
  const { row, col } = findCellFromNumber(grid, number);
  let nextRow = row;
  let answer = grid[row][col].value;
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    answer += grid[nextRow][col].value;
  }
  return answer;
}

function getAnswer(number: number, direction: Direction, grid: Grid): string {
  if (direction === 'across') {
    return getAnswerAcross(number, grid);
  }
  return getAnswerDown(number, grid);
}

export async function fetchClues(number: number, direction: Direction, gridState: Grid): Promise<Array<string>> {
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
