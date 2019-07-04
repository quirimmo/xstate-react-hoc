import React, { PureComponent, ComponentType, ReactNode } from 'react';
import {
  Interpreter, DefaultContext, StateSchema, EventObject, StateMachine, interpret, State, OmniEventObject,
} from 'xstate';
import { Subtract } from 'utility-types';

export interface WithXStateMachineProps<TContext extends DefaultContext, TStateSchema extends StateSchema, TEvent extends EventObject> {
  interpreter: Interpreter<TContext, TStateSchema, TEvent>;
  current: State<TContext, TEvent>;
}

type ComplexHOCType<U extends object, K extends U> = ComponentType<Subtract<K, U>>;

type HOCProps<
  TContext extends DefaultContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  T extends WithXStateMachineProps<TContext, TStateSchema, TEvent>
> = Subtract<T, WithXStateMachineProps<TContext, TStateSchema, TEvent>>;

export type HOCWithXStateMachineType<
  TContext extends DefaultContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  P extends WithXStateMachineProps<TContext, TStateSchema, TEvent>
> = ComplexHOCType<WithXStateMachineProps<TContext, TStateSchema, TEvent>, P>;

export interface WithXStateMachineComponentState<TContext extends DefaultContext, TEvent extends EventObject> {
  current: State<TContext, TEvent>;
}

export function withXStateMachine<
  TContext extends DefaultContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  P extends WithXStateMachineProps<TContext, TStateSchema, TEvent>
>(
  Component: ComponentType<P>,
  machine: StateMachine<TContext, TStateSchema, TEvent>,
): HOCWithXStateMachineType<TContext, TStateSchema, TEvent, P> {
  return class WithXStateMachineComponent extends PureComponent<
    HOCProps<TContext, TStateSchema, TEvent, P>,
    WithXStateMachineComponentState<TContext, TEvent>
  > {
    state: WithXStateMachineComponentState<TContext, TEvent> = { current: machine.initialState as State<TContext, TEvent> };

    private interpreter: Interpreter<TContext, TStateSchema, TEvent>;

    constructor(props: HOCProps<TContext, TStateSchema, TEvent, P>) {
      super(props);
      this.interpreter = interpret(machine).onTransition(this.onTransition);
    }

    componentDidMount(): void {
      this.interpreter.start();
    }

    componentWillUnmount(): void {
      this.interpreter.stop();
    }

    onTransition = (current: State<TContext, TEvent>, event: OmniEventObject<TEvent>): void => {
      console.log('Context:', current, '\n', 'Event:', event);
      this.setState({ current });
    };

    render(): ReactNode {
      const { current } = this.state;
      return <Component current={current} interpreter={this.interpreter} {...this.props as P} />;
    }
  };
}
