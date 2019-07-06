import React, { PureComponent, ComponentType, ReactNode } from 'react';
import {
  Interpreter, DefaultContext, StateSchema, EventObject, StateMachine, interpret, State, MachineOptions,
} from 'xstate';
import { Subtract } from 'utility-types';

export interface WithXStateMachineProps<TContext, TStateSchema extends StateSchema, TEvent extends EventObject> {
  interpreter: Interpreter<TContext, TStateSchema, TEvent>;
  current: State<TContext, TEvent>;
  machine: StateMachine<TContext, TStateSchema, TEvent>;
}

type ComplexHOCType<U extends object, K extends U> = ComponentType<Subtract<K, U>>;

type HOCProps<
  TContext extends DefaultContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  T extends WithXStateMachineProps<TContext, TStateSchema, TEvent>
> = Subtract<T, WithXStateMachineProps<TContext, TStateSchema, TEvent>>;

export type HOCWithXStateMachineType<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  P extends WithXStateMachineProps<TContext, TStateSchema, TEvent>
> = ComplexHOCType<WithXStateMachineProps<TContext, TStateSchema, TEvent>, P>;

export interface WithXStateMachineComponentState<TContext extends DefaultContext, TEvent extends EventObject> {
  current: State<TContext, TEvent>;
}

export function withXStateMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  P extends WithXStateMachineProps<TContext, TStateSchema, TEvent>
>(
  Component: ComponentType<P>,
  machine: StateMachine<TContext, TStateSchema, TEvent>,
  initialContext?: TContext,
  extendedConfig?: Partial<MachineOptions<TContext, TEvent>>,
): HOCWithXStateMachineType<TContext, TStateSchema, TEvent, P> {
  return class WithXStateMachineComponent extends PureComponent<
    HOCProps<TContext, TStateSchema, TEvent, P>,
    WithXStateMachineComponentState<TContext, TEvent>
  > {
    state: WithXStateMachineComponentState<TContext, TEvent> = { current: machine.initialState };

    private machine: StateMachine<TContext, TStateSchema, TEvent>;
    private interpreter: Interpreter<TContext, TStateSchema, TEvent>;

    constructor(props: HOCProps<TContext, TStateSchema, TEvent, P>) {
      super(props);
      this.machine = machine.withConfig(extendedConfig || {}, initialContext);
      this.interpreter = interpret(this.machine).onTransition(this.onTransition);
    }

    componentDidMount(): void {
      this.interpreter.start();
    }

    componentWillUnmount(): void {
      this.interpreter.stop();
    }

    onTransition = (current: State<TContext, TEvent>): void => {
      this.setState({ current });
    };

    render(): ReactNode {
      const { current } = this.state;
      return <Component machine={this.machine} current={current} interpreter={this.interpreter} {...this.props as P} />;
    }
  };
}
