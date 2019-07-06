import React, { PureComponent, ReactNode } from 'react';
import { withStateMachine, WithStateMachineProps } from './xstate-react-hoc/with-state-machine';
import {
  AppMachineContext, AppMachineStateSchema, AppMachineEvent, appStateMachineConfig,
} from './app-state-machine';


class NewContent extends PureComponent<WithStateMachineProps<AppMachineContext, AppMachineStateSchema, AppMachineEvent>> {
  onToggle = (): void => {
    const { sendEvent } = this.props;
    sendEvent({ type: 'TOGGLE' });
  };

  render(): ReactNode {
    const { machineState } = this.props;
    return (
      <div className="component-wrapper">
        <button type="button" onClick={this.onToggle}>Toggle</button>
        <br />
        <pre>
          <code>{JSON.stringify(machineState, null, 4)}</code>
        </pre>
      </div>
    );
  }
}


export default withStateMachine(NewContent, appStateMachineConfig);
