# Crossword Puzzle Starter Kit

Creates empty grid of any size with symmetric blanks, and numbered squares.

## Bugs
* Writing over existing character results in lower case letter
* Advancing via Tab press does not skip over blanks
* Advancing via Tab press only moves across (not down)


## Next Steps
* Provide possible answers for given word space
* Provide possible clues for each entered answer
* Clue height determined by input
* Maneuvering through grid with arrow keys
* Persisting / Saving crosswords
  * New View / Route with list of saved puzzles (click to open in grid-builder)
	* UI for loading persisted crosswords
* Enable clue creation
  * Show numbered clues (Across / Down)
  * Allow clues to be edited and persisted with the crossword
* Word List
* Option to fill in a word (a word that doesn't also create non-words)
* Option for completing the puzzle
* Sass
* Clean up


## Credits

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.
