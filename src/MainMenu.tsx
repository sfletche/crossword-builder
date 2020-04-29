import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'baseui/button';

type Props = {
	onLogout: () => void,
};

export default function MainMenu({ onLogout }: Props) {
	return (
	  <div>
	    <Link to="/">
	      <Button>Home</Button>
	    </Link>
	    <Link to="/grid-builder">
	      <Button>Grid Builder</Button>
	    </Link>
	    <Button onClick={onLogout}>Log out</Button>
	  </div>
	);
}