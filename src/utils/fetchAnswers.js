import { colToRightIsBlank, rowBelowIsBlank } from './utils';

function getQueryAcross(row, col, grid) {
  let nextCol = col;
  let query = grid[row][col].value || '?';
  while(!colToRightIsBlank(row, nextCol++, grid)) {
    query += grid[row][nextCol].value || '?';
  }
  return query;
}

function getQueryDown(row, col, grid) {
  let nextRow = row;
  let query = grid[row][col].value || '?';
  while(!rowBelowIsBlank(nextRow++, col, grid)) {
    query += grid[nextRow][col].value || '?';
  }
  return query;
}

function getQuery(row, col, direction, grid) {
  if (direction === 'across') {
    return getQueryAcross(row, col, grid);
  }
  return getQueryDown(row, col, grid);
}

export async function fetchAnswers(row, col, direction, gridState) {
  const query = getQuery(row, col, direction, gridState);
  console.log('query', query);
  const url = 'https://search-crossword-yq7gx54qazz4o5mrpmbrqhuoc4.us-east-2.es.amazonaws.com/_search';
  const queryParam = '?q=answer:' + query + `&size=50`;
  const resp = await fetch(url + queryParam);
  const jsonData = await resp.json();
  console.log("jsonData: ", jsonData);
  if (jsonData.error && jsonData.status >= 400) {
    return [];
  }
  const answers = jsonData.hits.hits.map(hit => hit._source.answer);
  return answers;
}