import React, { PureComponent, ReactNode, ChangeEvent } from 'react';
import { ActionFunction } from 'xstate';
import { WithStateMachineProps } from './lib/with-state-machine';
import { withStateMachine } from './lib';
import {
  AppMachineCustomAction,
  appStateMachineOptions,
  AppMachineEventObject,
  AppMachineStateSchema,
  AppMachineContext,
  AppMachineState,
  AppMachineEvent,
  appStateMachineConfig,
} from './app-state-machine';


export type SampleComponentProps = WithStateMachineProps<AppMachineContext, AppMachineEventObject>;

class SampleComponent extends PureComponent<SampleComponentProps> {
  componentDidMount(): void {
    const { extendConfig } = this.props;
    extendConfig({ actions: { [AppMachineCustomAction.ON_SET_TEXT]: this.onSetTextAction() } });
  }

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

  onSetTextAction = (): ActionFunction<AppMachineContext, AppMachineEventObject> => (): void => { console.log('Hello world'); };

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
>(SampleComponent, appStateMachineConfig, appStateMachineOptions);
