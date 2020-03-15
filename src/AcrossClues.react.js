import React from 'react';
import Dropdown from 'react-dropdown';
import { fetchClues } from './utils';
import './AcrossClues.css';

// function setClue(clueState, clue, number, direction) {
//   return {
//     ...clueState,
//     [direction]: {
//       ...clueState[direction],
//       [number]: clue,
//     },
//   }
// }

// function getCluesWithSelection(clueState, clue, number, direction) {
//   let cluesWithSelection;
//   console.log('clueState', clueState)
//   cluesWithSelection = setClue(clueState, clue, number, direction);
//   console.log('cluesWithSelection', cluesWithSelection)
//   return cluesWithSelection;
//   // return clueState;
// }

export default class AcrossClues extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clues: [],
    };

    this.handleClueSelect = this.handleClueSelect.bind(this);
    this.handleNumberClick = this.handleNumberClick.bind(this);
    this.setClue = this.setClue.bind(this);
  }

  async handleNumberClick(e, number, direction) {
    const { gridState } = this.props;
    e.stopPropagation();
    console.log('number click', number, direction);
    const clues = await fetchClues(number, direction, gridState);
    console.log('clues', clues);
    // order alphabetically and de-dupe
    this.setState({ 
      clues, 
      clueNumber: number,
      showDropdown: true,
    });
  }

  setClue(clue) {
    const { updateClues } = this.props;
    const { clueNumber } = this.state;
    // const cluesCopy = { ...clueState };
    // const cluesWithSelection = getCluesWithSelection(cluesCopy, clue, clueNumber, 'across');
    updateClues(clueNumber, 'across', clue);
  }

  handleClueSelect(clue) {
    console.log('handleclueSelect')
    console.log('clue', clue)
    const cluesCopy = this.setClue(clue.value);
    this.setState({
      clues: [],
      showDropdown: false,
    });
  }

  render() {
    const { clueState, onClueUpdate } = this.props;
    const { clues, showDropdown } = this.state;
  	return (
  		<div className="flex minw350 space-between">
        <div>
          {showDropdown && 
            <Dropdown 
              className="clue-dropdown"
              menuClassName="dropdownMenu"
              onChange={this.handleClueSelect} 
              options={clues} 
              placeholder="Select a clue" 
            />
          }
        </div>
        <div>
          <h4 className="mb5">Across</h4>
          {Object.keys(clueState.across).map(key => (
            <div key={key + 'across'}>
              <div 
                className="rightJustify"
                onClick={(e) => this.handleNumberClick(e, key, 'across')}
              >
                {key}
              </div>
              <textarea
                className="clue"
                key={key + 'across'}
                onChange={(e) => onClueUpdate(key, 'across', e.target.value)}
                value={clueState.across[key]}
              />
            </div>
          ))}        
        </div>
      </div>
  	);
  }
}

