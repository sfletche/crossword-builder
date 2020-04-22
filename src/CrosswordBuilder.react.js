import React from 'react';
import Dropdown from 'react-dropdown';
import ReactToPrint from 'react-to-print';
import {
  clearHighlights,
  enumerate,
  fetchAnswers,
  fetchClues,
  findFocus,
  getGridWithAnswer,
  highlightWordAcross,
  highlightWordDown,
  initializeClues,
  initializeGrid,
  slugify,
  updateClueState,
  INIT_SIZE,
} from './utils';
import Clues from './Clues';
import InputButtons from './InputButtons';
import PersistedCrosswordList from './PersistedCrosswordList';
import Puzzle from './Puzzle';
import './CrosswordBuilder.css';


export default class CrosswordBuilder extends React.Component{
  constructor(props) {
    super(props);

    this.componentRef = React.createRef();

    const gridState = initializeGrid();

    this.state = {
      across: true,
      answerDirection: props.across ? 'across' : 'down',
      answerNumber: null,
      answers: [],
      blanks: false,
      clueNumber: null,
      clues: [],
      clueState: initializeClues(gridState),
      gridSize: INIT_SIZE,
      gridState: gridState,
      puzzleHasFocus: true,
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
      showAnswersDropdown: false,
      tempSize: INIT_SIZE,
      title: "My Crossword Puzzle",
    };

    this.handleAnswerSelect = this.handleAnswerSelect.bind(this);
    this.handleClueNumberClick = this.handleClueNumberClick.bind(this);
    this.handleClueSelect = this.handleClueSelect.bind(this);
    this.handleClueUpdate = this.handleClueUpdate.bind(this);
    this.handleDirectionToggle = this.handleDirectionToggle.bind(this);
    this.handleGridNumberClick = this.handleGridNumberClick.bind(this);
    this.handleGridUpdate = this.handleGridUpdate.bind(this);
    this.handleOpenCrossword = this.handleOpenCrossword.bind(this);
    this.handleSetAcross = this.handleSetAcross.bind(this);
    this.handleSetBlanks = this.handleSetBlanks.bind(this);
    this.handleSetDown = this.handleSetDown.bind(this);
    this.handleSetLetters = this.handleSetLetters.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTitleUpdate = this.handleTitleUpdate.bind(this);
    this.saveCrossword = this.saveCrossword.bind(this);
    this.setClue = this.setClue.bind(this);
    this.setAnswer = this.setAnswer.bind(this);
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
    const { clueState } = this.state;
    this.setState({ puzzleHasFocus: false });
    if (direction === 'across') {
      const newClues = {
        ...clueState,
        across: {
          ...clueState.across,
          [number]: clue,
        },
      };
      console.log('newClues', newClues)
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
    this.setState({ puzzleHasFocus: true });
    if (blanks) {
      const enumeratedGrid = enumerate(grid);
      this.setState({ 
        gridState: enumeratedGrid,
        clueState: updateClueState(enumeratedGrid, clueState),
      });
    } else {
      this.setState({ gridState: grid });
    }
    this.setState({
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
      showAnswersDropdown: false,
    });
  };

  handleTitleUpdate(title) {
    this.setState({ 
      puzzleHasFocus: false,
      title, 
    });
  }

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
    this.setState({ across: true });
    const focusedCell = findFocus(grid);
    const highlightedGrid = highlightWordAcross(focusedCell.row, focusedCell.col, grid);
    //TODO this.setState({ clueState: to highlight clue as well });
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

  setAnswer(answer) {
    const { gridState, onGridUpdate } = this.props;
    const { answerNumber, answerDirection } = this.state;
    const gridCopy = [...gridState];
    const gridWithAnswer = getGridWithAnswer(gridCopy, answer, answerNumber, answerDirection);
    onGridUpdate(gridWithAnswer);
  }

  handleAnswerSelect(answer) {
    this.setAnswer(answer.value);
    this.setState({
      answers: [],
      showAnswersDropdown: false,
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
    });
  }

  setClue(clue, direction) {
    const { clueNumber } = this.state;
    this.handleClueUpdate(clueNumber, direction, clue);
  }

  handleClueSelect(clue, direction) {
    this.setClue(clue.value, direction);
    this.setState({
      clues: [],
      showAnswersDropdown: false,
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
    });
  }

  async handleGridNumberClick(e, row, col) {
    const { across, gridState } = this.state;
    const direction = across ? 'across' : 'down';
    e.stopPropagation();
    const answers = await fetchAnswers(row, col, direction, gridState);
    console.log('answers', answers);
    // TODO: order alphabetically and de-dupe
    this.setState({ 
      answers, 
      answerDirection: direction,
      answerNumber: gridState[row][col].number,
      showAnswersDropdown: true,
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
    });
  }

  async handleClueNumberClick(e, number, direction) {
    const { gridState } = this.state;
    const showAcross = direction === 'across';
    e.stopPropagation();
    const clues = await fetchClues(number, direction, gridState);
    // order alphabetically and de-dupe
    this.setState({ 
      clues, 
      clueNumber: number,
      showAnswersDropdown: false,
      showAcrossCluesDropdown: showAcross,
      showDownCluesDropdown: !showAcross,
    });
  }

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
      answers,
      blanks,
      clues,
      clueState,
      gridSize,
      gridState,
      puzzleHasFocus,
      showAcrossCluesDropdown,
      showDownCluesDropdown,
      showAnswersDropdown,
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
            onNumberClick={this.handleGridNumberClick}
            onSetAcross={this.handleSetAcross}
            onSetDown={this.handleSetDown}
            puzzleHasFocus={puzzleHasFocus}
            title={title}
            updateTitle={this.handleTitleUpdate}
          />
          <Clues
            clueState={clueState}
            gridState={gridState}
            onClueUpdate={this.handleClueUpdate}
            onNumberClick={this.handleClueNumberClick}
          />
          {showAnswersDropdown && 
            <Dropdown 
              className="dropdown"
              menuClassName="dropdownMenu"
              onChange={this.handleAnswerSelect} 
              options={answers} 
              placeholder="Select an answer" 
            />
          }
          {showAcrossCluesDropdown && 
            <Dropdown 
              className="clue-dropdown"
              menuClassName="dropdownMenu"
              onChange={clue => this.handleClueSelect(clue, 'across')} 
              options={clues} 
              placeholder="Select a clue" 
            />
          }
          {showDownCluesDropdown && 
            <Dropdown 
              className="clue-dropdown"
              menuClassName="dropdownMenu"
              onChange={clue => this.handleClueSelect(clue, 'down')} 
              options={clues} 
              placeholder="Select a clue" 
            />
          }
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
