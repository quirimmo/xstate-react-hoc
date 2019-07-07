import React, { PureComponent, ReactNode, ChangeEvent } from 'react';
import { withStateMachine, WithStateMachineProps } from './xstate-react-hoc/with-state-machine';
import {
  appStateMachineOptions,
  AppMachineEventObject,
  AppMachineStateSchema,
  AppMachineContext,
  AppMachineState,
  AppMachineEvent,
  appStateMachineConfig,
} from './app-state-machine';

export type NewContentProps = WithStateMachineProps<AppMachineContext, AppMachineEventObject>;

class NewContent extends PureComponent<NewContentProps> {
  isVisible = (): boolean => {
    const { machineState } = this.props;
    return machineState.matches(AppMachineState.VISIBLE);
  };

  onToggle = (): void => {
    const { sendEvent } = this.props;
    sendEvent({ type: AppMachineEvent.TOGGLE });
  };

  onChangeText = (ev: ChangeEvent<HTMLInputElement>): void => {
    const { sendEvent } = this.props;
    sendEvent({ type: AppMachineEvent.SET_TEXT, text: ev.currentTarget.value });
  };

  render(): ReactNode {
    const { machineContext: { text } } = this.props;

    return (
      <div className="component-wrapper">
        <button type="button" onClick={this.onToggle}>Toggle</button>
        <input type="text" value={text} onChange={this.onChangeText} />
        <br />
        {this.isVisible() && <div>{text}</div>}
      </div>
    );
  }
}

export default withStateMachine<
AppMachineContext,
AppMachineStateSchema,
AppMachineEventObject,
WithStateMachineProps<AppMachineContext, AppMachineEventObject>
>(NewContent, appStateMachineConfig, appStateMachineOptions);
