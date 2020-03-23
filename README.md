# Crossword Puzzle Starter Kit

Creates empty grid of any size with symmetric blanks, and numbered squares.

## Bugs
* Writing over existing character results in lower case letter
* Advancing via Tab press does not skip over blanks
* Advancing via Tab press only moves across (not down)
* Writing into clue inputs jumps back to grid inputs
* Printable view no longer useful


## Next Steps
* Highlight clue to match highlighted word
* Maneuvering through grid with arrow keys (see https://jaredreisinger.github.io/react-crossword/)
* Provide possible answers for given word space
* Provide possible clues for each entered answer
* Option to disable blank square symmetry
* Default to 1 across when opening saved puzzle
* Clue height determined by input
* Persisting / Saving crosswords
  * New View / Route with list of saved puzzles (click to open in grid-builder)
	* UI for loading persisted crosswords
* Word List
* Option to fill in a word (a word that doesn't also create non-words)
* Option for completing the puzzle
* actual css modules
* integrate typescript
* Install Greenkeeper or alternative
* switch to yarn
* add firebase 
* add linting
* checkout github.pages.io -- https://pages.github.com/ -- (not sure about privacy with this option though)



## Credits

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
