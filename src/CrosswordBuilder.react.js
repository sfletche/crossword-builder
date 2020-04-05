import React from 'react';
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
  updateClueState,
  INIT_SIZE,
} from './utils/utils';
import Clues from './Clues.react';
import InputButtons from './InputButtons.react';
import PersistedCrosswordList from './PersistedCrosswordList.react';
import Puzzle from './Puzzle.react';
import './CrosswordBuilder.css';


export default class CrosswordBuilder extends React.Component{
  constructor(props) {
    super(props);

    this.componentRef = React.createRef();

    const gridState = initializeGrid();

    this.state = {
      gridSize: INIT_SIZE,
      gridState: gridState,
      clueState: initializeClues(gridState),
      tempSize: INIT_SIZE,
      blanks: false,
      across: true,
      title: "My Crossword Puzzle",
    };

    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClueUpdate = this.handleClueUpdate.bind(this);
    this.handleGridUpdate = this.handleGridUpdate.bind(this);
    this.handleSetBlanks = this.handleSetBlanks.bind(this);
    this.handleSetLetters = this.handleSetLetters.bind(this);
    this.handleSetAcross = this.handleSetAcross.bind(this);
    this.handleSetDown = this.handleSetDown.bind(this);
    this.handleDirectionToggle = this.handleDirectionToggle.bind(this);
    this.handleOpenCrossword = this.handleOpenCrossword.bind(this);
    this.saveCrossword = this.saveCrossword.bind(this);
  }
  
  handleSizeChange(event) {
    this.setState({ tempSize: event.target.value });
  };

  handleSubmit(event) {
    event.preventDefault();
    const grid = initializeGrid(this.state.tempSize);
    const clues = initializeClues(grid);
    this.setState({ 
      clueState: clues, 
      gridState: grid,
      gridSize: this.state.tempSize,
    });
  };

  handleClueUpdate(number, direction, clue) {
    const {
      clueState,
    } = this.state;
    if (direction === 'across') {
      const newClues = {
        ...clueState,
        across: {
          ...clueState.across,
          [number]: clue,
        },
      };
      this.setState({ clueState: newClues });
    } else {
      const newClues = {
        ...clueState,
        down: {
          ...clueState.down,
          [number]: clue,
        },
      };
      this.setState({ clueState: newClues });
    }
  }

  handleGridUpdate(grid) {
    const {
      blanks,
      clueState,
    } = this.state;
    if (blanks) {
      const enumeratedGrid = enumerate(grid);
      this.setState({ 
        gridState: enumeratedGrid,
        clueState: updateClueState(enumeratedGrid, clueState),
      });
    } else {
      this.setState({ gridState: grid });
    }
  };

  handleSetBlanks() {
    const {
      gridState,
    } = this.state;
    this.setState({ blanks: true });
    const gridWithoutHighlights = clearHighlights(gridState);
    this.setState({ gridState: gridWithoutHighlights });
  };

  handleSetLetters() {
    this.setState({ blanks: false });
  };

  handleSetAcross(grid) {
    const {
      clueState,
    } = this.state;
    this.setState({ across: true });
    const focusedCell = findFocus(grid);
    const highlightedGrid = highlightWordAcross(focusedCell.row, focusedCell.col, grid);
    console.log('clueState', clueState);
    //TODO this.setState({ clueState: to highlight clue as we });
    // current clueState is { across: { 1: "clue1", 5: "clue5" }}
    // may change to { across: { 1: { clue: "clue1", highlighted: false } } }
    this.setState({ gridState: highlightedGrid });
  };

  handleSetDown(grid) {
    this.setState({ across: false });
    const focusedCell = findFocus(grid);
    const highlightedGrid = highlightWordDown(focusedCell.row, focusedCell.col, grid);
    //TODO this.setState({ clueState: to highlight clue as well });
    this.setState({ gridState: highlightedGrid });
  };

  handleDirectionToggle(grid) {
    const { across } = this.state;
    across ? this.handleSetDown(grid) : this.handleSetAcross(grid);
  };

  handleOpenCrossword(savedTitle, savedGridState, savedClueState) {
    this.setState({ title: savedTitle });
    this.setState({ gridState: savedGridState });
    this.setState({ clueState: savedClueState || initializeClues(savedGridState) });
  };

  saveCrossword() {
    const {
      clueState,
      gridState,
      title,
    } = this.state;
    const slug = slugify(title);
    const currentKeys = JSON.parse(localStorage.getItem('crosswordKeys'));
    if (!currentKeys.includes(slug)) {
      localStorage.setItem('crosswordKeys', JSON.stringify([...currentKeys, slug]));
    }
    localStorage.setItem(slug, JSON.stringify({ title, gridState, clueState }));
  };

  render() {
    const {
      across,
      blanks,
      clueState,
      gridSize,
      gridState,
      tempSize,
      title,
    } = this.state;
    return (
      <div className="ml20">
        <form onSubmit={this.handleSubmit}>
          <label>
            Grid Size (how many rows):
            <input type="text" value={tempSize} onChange={this.handleSizeChange} />
          </label>
          <input type="submit" value="Set Size" />
        </form>
        <InputButtons
          className="mt20"
          inputType={blanks ? 'blanks' : 'letters'}
          onSetBlanks={this.handleSetBlanks}
          onSetLetters={this.handleSetLetters}
        />
        <div ref={this.componentRef} className="printable">
          <Puzzle
            direction={across ? 'across' : 'down'}
            gridSize={gridSize}
            gridState={gridState}
            inputType={blanks ? 'blanks' : 'letters'}
            onDirectionToggle={this.handleDirectionToggle}
            onGridUpdate={this.handleGridUpdate}
            title={title}
            updateTitle={title => this.setState({ title })}
          />
          <Clues
            clueState={clueState}
            gridState={gridState}
            onClueUpdate={this.handleClueUpdate}
          />
        </div>
        <div className="mt20">
          <ReactToPrint
            content={() => this.componentRef.current}
            trigger={() => <button>Print Crossword</button>}
          />
          <button className="ml10" onClick={this.saveCrossword}>Save Crossword</button>
        </div>
        <div className="mt20">
          <PersistedCrosswordList onSelect={this.handleOpenCrossword} />
        </div>
      </div>
    );
  }
}
