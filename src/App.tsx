import React, { PureComponent, ReactNode } from 'react';
import './App.css';
import Content from './Content';
import FunctionalContent from './FunctionalContent';

class App extends PureComponent {
  render(): ReactNode {
    return (
      <div className="app-wrapper">
        <Content />
        <FunctionalContent />
      </div>
    );
  }
}


export default App;
