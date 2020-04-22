import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
	onLogout: () => void,
};

export default function MainMenu({ onLogout }: Props) {
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