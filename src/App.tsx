import React, { PureComponent, ReactNode } from 'react';
import './App.css';
import { interpret, EventObject, DefaultContext } from 'xstate';
import { toggleMachine } from './app-machine';

class App extends PureComponent {
  state = { current: toggleMachine.initialState };

  service = interpret(toggleMachine).onTransition((current: DefaultContext, event: EventObject): void => {
    console.log('Context:', current, '\n', 'Event:', event);
    this.setState({ current });
  });

  componentDidMount(): void {
    this.service.start();
  }

  componentWillUnmount(): void {
    this.service.stop();
  }

  onClick = (): void => {
    const { send } = this.service;
    send('TOGGLE');
  };

  render(): ReactNode {
    const { current } = this.state;

    return (
      <button type="button" onClick={this.onClick}>
        {current.matches('inactive') ? 'Off' : 'On'}
      </button>
    );
  }
}


export default App;
