import * as firebase from 'firebase/app';
import 'firebase/auth';

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import './App.css';
import MainMenu from './MainMenu.react';
import CrosswordBuilder from './CrosswordBuilder.react';
import Introduction from './Introduction.react';
import Login from './auth/Login.react';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB_dn3DoeVasMsAMYqd-r968LxDGTV3y3c",
  authDomain: "xword-builder.firebaseapp.com",
  databaseURL: "https://xword-builder.firebaseio.com",
  projectId: "xword-builder",
  storageBucket: "xword-builder.appspot.com",
  messagingSenderId: "367699219389",
  appId: "1:367699219389:web:c6837d1e9ca861f2e1f8d4",
  measurementId: "G-0XQNPN18SZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function onAuthStateChange(
  setUser: (arg0: { loggedIn: boolean, email: string }) => void,
) {
  const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in.
      setUser({
        loggedIn: true,
        email: user.email || '',
      });
    } else {
      // User is signed out.
      setUser({
        loggedIn: false,
        email: '',
      });
    }
  });
  return () => unsubscribe();
}

function handleLogin(email: string, password: string) {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        resolve();
      })
      .catch(error => {
        reject(error);
      });
  });
}

function handleLogout(setUser) {  
  firebase.auth().signOut().then(() => {
    setUser({ email: '', loggedIn: false });    
  });
}

function App() {
  const [user, setUser] = useState({
    email: '',
    loggedIn: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(setUser);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      { !user.loggedIn ? 
        <Login onLogin={handleLogin} user={user} /> 
        : (
        <Router>
          <div className="App">
            <MainMenu onLogout={() => { handleLogout(setUser); }} />       
          </div>
          <Switch>
            <Route exact path="/" component={Introduction} />
            <Route path="/login">
              <Login onLogin={handleLogin} user={user} />
            </Route>
            <Route path="/grid-builder">
              <CrosswordBuilder user={user} />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  );
}

export default App;
