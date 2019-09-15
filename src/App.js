import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import MainMenu from './MainMenu.react';
import GridBuilder from './GridBuilder.react';
import Introduction from './Introduction.react';

function App() {
  return (
    <Router>
      <div className="App">
        <MainMenu />       
      </div>
      <div>
        <Route exact path="/" component={Introduction} />
        <Route path="/grid-builder" component={GridBuilder} />
      </div>
    </Router>
  );
}

export default App;
