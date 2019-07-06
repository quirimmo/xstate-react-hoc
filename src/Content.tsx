import React, { PureComponent, ReactNode } from 'react';
import { State, OmniEventObject } from 'xstate';
import {
  toggleMachine, AppMachineContext, AppMachineEvent, AppMachineStateSchema,
} from './app-machine';
import { withXStateMachine, WithXStateMachineProps } from './xstate-react-hoc/with-xstate-machine';
import { MachineDisplayer } from './MachineDisplayer';


class Content extends PureComponent<WithXStateMachineProps<AppMachineContext, AppMachineStateSchema, AppMachineEvent>> {
  componentDidMount(): void {
    const { interpreter } = this.props;
    interpreter.onTransition(this.onTransition);
  }

  onTransition = (current: State<AppMachineContext, AppMachineEvent>, event: OmniEventObject<AppMachineEvent>): void => {
    console.log('TRANSITION HAPPENED!!', current, '\n', 'Event:', event);
  };

  onToggle = (): void => {
    const { interpreter: { send } } = this.props;
    send('TOGGLE');
  };

  onOther = (): void => {
    const { interpreter: { send } } = this.props;
    send('OTHER');
  };

  render(): ReactNode {
    const { current } = this.props;

    return (
      <div className="component-wrapper">
        <h1>Class Component</h1>
        <MachineDisplayer onToggle={this.onToggle} onOther={this.onOther} state={current.value} current={current.context} />
      </div>
    );
  }
}


export default withXStateMachine(Content, toggleMachine);
