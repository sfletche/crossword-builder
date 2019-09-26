import React, { useRef, useState } from 'react';
import ReactToPrint from 'react-to-print';
import {
	clearHighlights,
	enumerate,
	findFocus,
	highlightWordAcross,
	highlightWordDown,
  initializeClues,
  initializeGrid,
	slugify,
  INIT_SIZE,
} from './utils/utils';
import Clues from './Clues.react';
import InputButtons from './InputButtons.react';
import DirectionButtons from './DirectionButtons.react';
import PersistedCrosswordList from './PersistedCrosswordList.react';
import Puzzle from './Puzzle.react';
import './GridBuilder.css';


export default function GridBuilder() {
	const [gridSize, setGridSize] = useState(INIT_SIZE);
	const [gridState, setGridState] = useState(initializeGrid());
  const [clueState, setClueState] = useState(initializeClues(gridState))
	const [tempSize, setTempSize] = useState(INIT_SIZE);
	const [blanks, setBlanks] = useState(true);
	const [across, setAcross] = useState(true);
	const [title, updateTitle] = useState("My Crossword Puzzle");

	const handleChange = (event) => {
		setTempSize(event.target.value);
  };

	const handleSubmit = (event) => {
		event.preventDefault();
		setGridSize(tempSize);
		const grid = initializeGrid(tempSize);
		setGridState(grid);
	};

  const handleClueUpdate = (number, direction, clue) => {
    if (direction === 'across') {
      const newClues = {
        ...clueState,
        across: {
          ...clueState.across,
          [number]: clue,
        },
      };
      setClueState(newClues);
    } else {
      const newClues = {
        ...clueState,
        down: {
          ...clueState.down,
          [number]: clue,
        },
      };
      setClueState(newClues);
    }
  }

	const handleGridUpdate = (grid) => {
		setGridState(enumerate(grid));
	};

	const handleSetBlanks = () => {
		setBlanks(true);
		const gridWithoutHighlights = clearHighlights(gridState);
		setGridState(gridWithoutHighlights);
	};

	const handleSetLetters = () => {
		setBlanks(false);
	};

	const handleSetAcross = () => {
		setAcross(true);
		const focusedCell = findFocus(gridState);
		const highlightedGrid = highlightWordAcross(focusedCell.row, focusedCell.col, gridState);
		setGridState(highlightedGrid);
	};

	const handleSetDown = () => {
		setAcross(false);
		const focusedCell = findFocus(gridState);
		const highlightedGrid = highlightWordDown(focusedCell.row, focusedCell.col, gridState);
		setGridState(highlightedGrid);
	};

	const handleDirectionToggle = () => {
	  across ? handleSetDown() : handleSetAcross();
	};

	const handleOpenCrossword = (title, gridState, clueState) => {
		updateTitle(title);
		setGridState(gridState);
    setClueState(clueState);
	};

	const saveCrossword = () => {
		const slug = slugify(title);
		const currentKeys = JSON.parse(localStorage.getItem('crosswordKeys'));
		if (!currentKeys.includes(slug)) {
			localStorage.setItem('crosswordKeys', JSON.stringify([...currentKeys, slug]));
		}
		localStorage.setItem(slug, JSON.stringify({ title, gridState, clueState }));
	};

	const componentRef = useRef();

  return (
    <div className="ml20">
	  	<form onSubmit={handleSubmit}>
	      <label>
	        Grid Size (how many rows):
	        <input type="text" value={tempSize} onChange={handleChange} />
	      </label>
	      <input type="submit" value="Submit" />
		  </form>
		  <InputButtons
		  	className="mt20"
		  	inputType={blanks ? 'blanks' : 'letters'}
		  	onSetBlanks={handleSetBlanks}
		  	onSetLetters={handleSetLetters}
		  />
		  <DirectionButtons
		  	className="mt20"
		  	direction={across ? 'across' : 'down'}
		  	onSetAcross={handleSetAcross}
		  	onSetDown={handleSetDown}
		  />
		  <div ref={componentRef} className="printable">
        <Clues
          clueState={clueState}
          onClueUpdate={handleClueUpdate}
        />
        <Puzzle
          direction={across ? 'across' : 'down'}
          gridSize={gridSize}
          gridState={gridState}
          inputType={blanks ? 'blanks' : 'letters'}
          onDirectionToggle={handleDirectionToggle}
          onGridUpdate={handleGridUpdate}
          title={title}
          updateTitle={updateTitle}
        />
    	</div>
    	<div className="mt20">
	      <ReactToPrint
	        content={() => componentRef.current}
	        trigger={() => <button>Print Crossword</button>}
	      />
	    	<button className="ml10" onClick={saveCrossword}>Save Crossword</button>
	    </div>
	    <div className="mt20">
	    	<PersistedCrosswordList onSelect={handleOpenCrossword} />
	    </div>
	  </div>
  );
}
