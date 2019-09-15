import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { GlobalHotKeys } from 'react-hotkeys';
import './App.css';
import MainMenu from './MainMenu.react';
import GridBuilder from './GridBuilder.react';
import Introduction from './Introduction.react';

const keyMap = {
  BLANKS: 'command+shift+B',
  LETTERS: 'command+shift+L',
  ACROSS: 'command+shift+A',
  DOWN: 'command+shift+D',
};

function App() {
  return (
    <GlobalHotKeys keyMap={keyMap}>
      <Router>
        <div className="App">
          <MainMenu />       
        </div>
        <div>
          <Route exact path="/" component={Introduction} />
          <Route path="/grid-builder" component={GridBuilder} />
        </div>
      </Router>
    </GlobalHotKeys>
  );
}

export default App;
