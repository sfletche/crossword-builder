import React from 'react';
import { Link } from 'react-router-dom';

export default function MainMenu({ onLogout }) {
	return (
	  <div>
	    <Link to="/">
	      <button>Home</button>
	    </Link>
	    <Link to="/grid-builder">
	      <button>Grid Builder</button>
	    </Link>
	    <button onClick={onLogout}>Log out</button>
	  </div>
	);
}