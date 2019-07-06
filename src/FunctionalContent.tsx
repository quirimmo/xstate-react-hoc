import React, { SFC, ReactElement } from 'react';
import { State } from 'xstate';
import {
  toggleMachine, AppMachineContext, AppMachineEvent, AppMachineStateSchema,
} from './app-machine';
import { withXStateMachine, WithXStateMachineProps } from './xstate-react-hoc/with-xstate-machine';
import { MachineDisplayer } from './MachineDisplayer';

export interface ExtendedAppMAchineEvent extends AppMachineEvent {
  type: AppMachineEvent['type'] | 'new';
}

const FunctionalContent: SFC<
  WithXStateMachineProps<AppMachineContext, AppMachineStateSchema, ExtendedAppMAchineEvent>
> = (props: WithXStateMachineProps<AppMachineContext, AppMachineStateSchema, ExtendedAppMAchineEvent>): ReactElement => {
  const { current, interpreter } = props;
  const { send } = interpreter;

  const onToggle = (): State<AppMachineContext, ExtendedAppMAchineEvent> => send('TOGGLE');
  const onOther = (): State<AppMachineContext, ExtendedAppMAchineEvent> => send('OTHER');
  const onNew = (): State<AppMachineContext, ExtendedAppMAchineEvent> => send('new');

  return (
    <div className="component-wrapper">
      <h1>Functional Component</h1>
      <MachineDisplayer onToggle={onToggle} onOther={onOther} state={current.value} current={current.context} />
      <button type="button" onClick={onNew}>NEW</button>
    </div>
  );
};

export default withXStateMachine<
  AppMachineContext,
  AppMachineStateSchema,
  ExtendedAppMAchineEvent,
  WithXStateMachineProps<AppMachineContext, AppMachineStateSchema, ExtendedAppMAchineEvent>
>(FunctionalContent, toggleMachine, { test: 'overriding context' }, {});
