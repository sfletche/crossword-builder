import React from 'react';
import { Link } from 'react-router-dom';

export default function Introduction() {
	return (
    <div style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '50px',
    }}>
      <div>Welcome to Crossword Builder</div>
  	  <div>
        <Link to="/login">Log in</Link>
      </div>
      <div>
        <Link to="/grid-builder">Crossword Builder</Link>
  	  </div>
    </div>
	);
}