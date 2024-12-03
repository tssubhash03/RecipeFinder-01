// import logo from './logo.svg';
// import './App.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUpload from "./FileUpload";

function App() {
  return (
    <div style={{paddingLeft:300}}>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <h2 >
        React upload image file</h2>
        <FileUpload></FileUpload>
    </div>
  );
}

export default App;
