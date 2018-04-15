import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Webcam from 'react-webcam';
import WebcamCapture from './WebcamCapture';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Emoji Scavenger Hunt
        </p>
		<WebcamCapture/>
      </div>
    );
  }
}

export default App;
