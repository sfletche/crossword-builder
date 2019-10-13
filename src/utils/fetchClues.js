import { 
  colToRightIsBlank, 
  findCellFromNumber,
  rowBelowIsBlank,
} from './utils';

function getAnswerAcross(number, grid) {
  const { row, col } = findCellFromNumber(grid, number);
  let nextCol = col;
  let answer = grid[row][col].value;
  while(!colToRightIsBlank(row, nextCol++, grid)) {
    answer += grid[row][nextCol].value;
  }
  return answer;
}

function getAnswerDown(number, grid) {
  const { row, col } = findCellFromNumber(grid, number);
  let nextRow = row;
  let answer = grid[row][col].value;
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    answer += grid[nextRow][col].value;
  }
  return answer;
}

function getAnswer(number, direction, grid) {
  if (direction === 'across') {
    return getAnswerAcross(number, grid);
  }
  return getAnswerDown(number, grid);
}

export async function fetchClues(number, direction, gridState) {
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
  const clues = jsonData.hits.hits[0]._source.clues;
  return clues;
}