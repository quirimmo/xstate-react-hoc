import React, { PureComponent, ReactNode } from 'react';
import {
  StateSchema, EventObject, State, OmniEventObject, DefaultContext,
} from 'xstate';
import { toggleMachine } from './app-machine';
import { withXStateMachine, WithXStateMachineProps } from './xstate-react-hoc/with-xstate-machine';

export interface ContentContext {
  test: string;
}

class Content<
  ContentContext extends DefaultContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
> extends PureComponent<WithXStateMachineProps<ContentContext, TStateSchema, TEvent>> {
  constructor(props: WithXStateMachineProps<ContentContext, TStateSchema, TEvent>) {
    super(props);
    const { interpreter } = this.props;
    const cont: DefaultContext = { test: 'a' };
    interpreter.machine.withContext(cont as ContentContext);
  }

  componentDidMount(): void {
    const { interpreter } = this.props;
    interpreter.onTransition(this.onTransition);
  }

  onTransition = (current: State<ContentContext, TEvent>, event: OmniEventObject<TEvent>): void => {
    console.log('TRANSITION HAPPENED!!', current, '\n', 'Event:', event);
  };

  onClick = (): void => {
    const { interpreter: { send } } = this.props;
    send('TOGGLE');
  };

  onClickNewState = (): void => {
    const { interpreter: { send } } = this.props;
    send('OTHER');
  };

  render(): ReactNode {
    const { current } = this.props;

    return (
      <>
        <button type="button" onClick={this.onClick}>
          {current.matches('inactive') ? 'Off' : 'On'}
        </button>
        <br />
        <br />
        <button type="button" onClick={this.onClick}>
          {current.matches('inactive') ? 'On' : 'Off'}
        </button>
        <br />
        <br />
        <button type="button" onClick={this.onClickNewState}>
          {current.matches('other') ? 'OTHER' : 'NOPE'}
        </button>
        <br />
        <br />
        <div>
          <h1>
            Current State:
            {' '}
            {current.value}
          </h1>
        </div>
      </>
    );
  }
}


export default withXStateMachine(Content, toggleMachine);
