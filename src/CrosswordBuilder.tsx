import React, { ChangeEvent, Component, createRef, FormEvent, MouseEvent } from 'react';
import Dropdown from 'react-dropdown';
import ReactToPrint from 'react-to-print';
import { Button } from 'baseui/button';
import { FlexGrid } from 'baseui/flex-grid';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { styled } from 'baseui';

import {
  clearGridHighlights,
  clearClueHighlights,
  enumerate,
  fetchAnswers,
  fetchClues,
  findAcrossClueNumber,
  findCellFromNumber,
  findDownClueNumber,
  findFocus,
  getGridWithAnswer,
  highlightWordAcross,
  highlightWordDown,
  initializeClues,
  initializeGrid,
  setFocus,
  slugify,
  updateCluesState,
  INIT_SIZE,
} from './utils';
import Clues from './Clues';
import Dropdowns from './Dropdowns';
import InputButtons from './InputButtons';
import PersistedCrosswordList from './PersistedCrosswordList';
import Puzzle from './Puzzle';
import './CrosswordBuilder.css';

import type {
  CluesState,
  Direction,
  GridState,
} from './types';

const ButtonContainer = styled('div', {
  alignSelf: 'flex-end',
});

type Props = {};

type State = {
  across: boolean,
  answerDirection: Direction,
  answerNumber: string,
  answers: Array<string>,
  blanks: boolean,
  clueNumber: string,
  clues: Array<string>,
  cluesState: CluesState,
  gridSize: number,
  gridState: GridState,
  puzzleHasFocus: boolean,
  showAcrossCluesDropdown: boolean,
  showDownCluesDropdown: boolean,
  showAnswersDropdown: boolean,
  tempSize: number,
  title: string,
};

export default class CrosswordBuilder extends Component<Props,State> {
  constructor(props: Props) {
    super(props);

    const gridState = initializeGrid(INIT_SIZE);

    this.state = {
      across: true,
      answerDirection: 'across',
      answerNumber: null,
      answers: [],
      blanks: false,
      clueNumber: null,
      clues: [],
      cluesState: initializeClues(gridState),
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
    this.setAnswer = this.setAnswer.bind(this);
    this.setClue = this.setClue.bind(this);
  }
    
  componentRef = createRef<HTMLDivElement>();
  
  handleSizeChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ tempSize: parseInt(event.target.value, 10) });
  };

  handleSubmit(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const grid = initializeGrid(this.state.tempSize);
    const clues = initializeClues(grid);
    this.setState({ 
      cluesState: clues, 
      gridState: grid,
      gridSize: this.state.tempSize,
    });
  };

  handleClueUpdate(number: string, direction: Direction, clue: string) {
    const { cluesState, gridState } = this.state;
    const clearedClues = clearClueHighlights(cluesState);
    this.setState({ puzzleHasFocus: false });
    if (direction === 'across') {
      const newClueState = {
        ...clearedClues,
        across: {
          ...clearedClues.across,
          [number]: { clue, highlighted: true },
        },
      };
      this.setState({ cluesState: newClueState });

      const { row, col } = findCellFromNumber(gridState, number);
      const highlightedGrid = highlightWordAcross(row, col, gridState);
      this.setState({ gridState: highlightedGrid });
    } else {
      const newClueState = {
        ...clearedClues,
        down: {
          ...clearedClues.down,
          [number]: { clue, highlighted: true },
        },
      };
      this.setState({ cluesState: newClueState });

      const { row, col } = findCellFromNumber(gridState, number);
      const highlightedGrid = highlightWordDown(row, col, gridState);
      this.setState({ gridState: highlightedGrid });
    }
    // TODO this.setState({ cluesState: to highlight clue as well });
    // current cluesState is { across: { 1: "clue1", 5: "clue5" }}
    // may change to { across: { 1: { clue: "clue1", highlighted: false } } }
  }

  handleGridUpdate(grid: GridState) {
    const {
      blanks,
      cluesState,
    } = this.state;
    this.setState({ puzzleHasFocus: true });
    if (blanks) {
      const enumeratedGrid = enumerate(grid);
      this.setState({ 
        gridState: enumeratedGrid,
        cluesState: updateCluesState(enumeratedGrid, cluesState),
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

  handleTitleUpdate(title: string) {
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
    const gridWithoutHighlights = clearGridHighlights(gridState);
    this.setState({ gridState: gridWithoutHighlights });
  };

  handleSetLetters() {
    this.setState({ blanks: false });
  };

  handleSetAcross(grid: GridState) {
    this.setState({ across: true });
    const focusedCell = findFocus(grid);
    const highlightedGrid = highlightWordAcross(focusedCell.row, focusedCell.col, grid);
    this.setState({ gridState: highlightedGrid });

    const { cluesState } = this.state;
    const clearedClues = clearClueHighlights(cluesState);
    const clueNumber = findAcrossClueNumber(focusedCell.row, focusedCell.col, grid);
    clearedClues.across[clueNumber].highlighted = true;
    this.setState({
      cluesState: clearedClues,
    });
  };

  handleSetDown(grid: GridState) {
    this.setState({ across: false });
    const focusedCell = findFocus(grid);
    const highlightedGrid = highlightWordDown(focusedCell.row, focusedCell.col, grid);
    //TODO this.setState({ cluesState: to highlight clue as well });
    this.setState({ gridState: highlightedGrid });

    const { cluesState } = this.state;
    const clearedClues = clearClueHighlights(cluesState);
    const clueNumber = findDownClueNumber(focusedCell.row, focusedCell.col, grid);
    clearedClues.down[clueNumber].highlighted = true;
    this.setState({
      cluesState: clearedClues,
    });
  };

  handleDirectionToggle(grid: GridState) {
    const { across } = this.state;
    across ? this.handleSetDown(grid) : this.handleSetAcross(grid);
  };

  handleOpenCrossword(savedTitle: string, savedGrid: GridState, savedClues: CluesState) {
    const gridWithFocus = setFocus(savedGrid, 0, 0);
    this.setState({ 
      title: savedTitle,
      gridState: gridWithFocus,
      cluesState: savedClues || initializeClues(gridWithFocus),
    });
  };

  setAnswer(answer: string) {
    const { answerDirection, answerNumber, gridState } = this.state;
    const gridCopy = [...gridState];
    const gridWithAnswer = getGridWithAnswer(gridCopy, answer, answerNumber, answerDirection);
    this.handleGridUpdate(gridWithAnswer);
  }

  handleAnswerSelect(answer: { value: string }) {
    this.setAnswer(answer.value);
    this.setState({
      answers: [],
      showAnswersDropdown: false,
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
    });
  }

  setClue(clue: string, direction: Direction) {
    const { clueNumber } = this.state;
    this.handleClueUpdate(clueNumber, direction, clue);
  }

  handleClueSelect(clue: { value: string }, direction: Direction) {
    this.setClue(clue.value, direction);
    this.setState({
      clues: [],
      showAnswersDropdown: false,
      showAcrossCluesDropdown: false,
      showDownCluesDropdown: false,
    });
  }

  async handleGridNumberClick(e: MouseEvent<HTMLElement>, row: number, col: number) {
    const { across, gridState } = this.state;
    const direction = across ? 'across' : 'down';
    e.stopPropagation();
    const answers = await fetchAnswers(row, col, direction, gridState);
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

  async handleClueNumberClick(e: MouseEvent<HTMLElement>, number: string, direction: Direction) {
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
      cluesState,
      gridState,
      title,
    } = this.state;
    const slug = slugify(title);
    const currentKeys = JSON.parse(localStorage.getItem('crosswordKeys'));
    if (!currentKeys.includes(slug)) {
      localStorage.setItem('crosswordKeys', JSON.stringify([...currentKeys, slug]));
    }
    localStorage.setItem(slug, JSON.stringify({ title, gridState, cluesState }));
  };


  render() {
    const {
      across,
      answers,
      blanks,
      clues,
      cluesState,
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
        <FlexGrid flexDirection="row" justifyContent="flex-start">
          <div>
            <FormControl
              overrides={{
                ControlContainer: {
                  style: () => ({
                    marginBottom: 0,
                  }),
                },
              }}
              label={() => "Grid Size (how many rows):"}
            >
              <Input type="text" value={tempSize} onChange={this.handleSizeChange} />
            </FormControl>
          </div>
          <ButtonContainer>
            <Button onClick={this.handleSubmit}>
              Set Size
            </Button>
          </ButtonContainer>
        </FlexGrid>
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
            cluesState={cluesState}
            onClueUpdate={this.handleClueUpdate}
            onNumberClick={this.handleClueNumberClick}
          />
          <Dropdowns
            answers={answers}
            clues={clues}
            onAnswerSelect={this.handleAnswerSelect}
            onClueSelect={this.handleClueSelect}
            showAcrossCluesDropdown={showAcrossCluesDropdown}
            showAnswersDropdown={showAnswersDropdown}
            showDownCluesDropdown={showDownCluesDropdown}
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
