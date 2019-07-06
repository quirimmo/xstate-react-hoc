import React, { SFC, ReactElement } from 'react';
import { State } from 'xstate';
import {
  toggleMachine, AppMachineContext, AppMachineEvent, AppMachineStateSchema,
} from './app-machine';
import { withXStateMachine, WithXStateMachineProps } from './xstate-react-hoc/with-xstate-machine';
import { MachineDisplayer } from './MachineDisplayer';

const FunctionalContent: SFC<
  WithXStateMachineProps<AppMachineContext, AppMachineStateSchema, AppMachineEvent>
> = (props: WithXStateMachineProps<AppMachineContext, AppMachineStateSchema, AppMachineEvent>): ReactElement => {
  const { current, interpreter: { send } } = props;

  const onToggle = (): State<AppMachineContext, AppMachineEvent> => send('TOGGLE');

  const onOther = (): State<AppMachineContext, AppMachineEvent> => send('OTHER');

  return (
    <div className="component-wrapper">
      <h1>Functional Component</h1>
      <MachineDisplayer onToggle={onToggle} onOther={onOther} state={current.value} current={current.context} />
    </div>
  );
};

export default withXStateMachine(FunctionalContent, toggleMachine);
