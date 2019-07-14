import React, { PureComponent, ReactNode } from 'react';
import './App.css';
import SampleComponent from './SampleComponent';

class App extends PureComponent {
  render(): ReactNode {
    return (
      <div className="app-wrapper">
        <SampleComponent />
      </div>
    );
  }
}

export default App;
