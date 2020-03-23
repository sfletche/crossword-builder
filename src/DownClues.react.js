import React from 'react';
import Dropdown from 'react-dropdown';
import { fetchClues } from './utils';


export default class DownClues extends React.Component {
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
    const { onClueUpdate } = this.props;
    const { clueNumber } = this.state;
    // const cluesCopy = { ...clueState };
    // const cluesWithSelection = getCluesWithSelection(cluesCopy, clue, clueNumber, 'across');
    onClueUpdate(clueNumber, 'down', clue);
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
          <h4 className="mb5">Down</h4>
          {Object.keys(clueState.down).map(key => (
            <div key={key + 'down'}>
              <div 
                className="rightJustify"
                onClick={(e) => this.handleNumberClick(e, key, 'down')}
              >
                {key}
              </div>
              <textarea
                className="clue"
                key={key + 'down'}
                onChange={(e) => onClueUpdate(key, 'down', e.target.value)}
                value={clueState.down[key]}
              />
            </div>
          ))}        
        </div>
      </div>
    );
  }
}
