import React, { PureComponent, ReactNode } from 'react';
import './App.css';
// import Content from './Content';
// import FunctionalContent from './FunctionalContent';
import NewContent from './NewContent';

class App extends PureComponent {
  render(): ReactNode {
    return (
      <div className="app-wrapper">
        <NewContent />
        {/* <br />
        <br />
        <Content />
        <FunctionalContent /> */}
      </div>
    );
  }
}


export default App;
