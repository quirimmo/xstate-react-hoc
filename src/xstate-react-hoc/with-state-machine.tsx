import React, { PureComponent, ComponentType, ReactNode } from 'react';
import { Subtract } from 'utility-types';
import {
  MachineConfig, EventObject, StateSchema, StateMachine, Machine, Interpreter, interpret, State,
} from 'xstate';

export interface WithStateMachineProps<TContext, TStateSchema extends StateSchema, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
  machine: StateMachine<TContext, TStateSchema, TEvent>;
  sendEvent: (event: TEvent) => void;
}

type ComplexHOCType<U extends object, K extends U> = ComponentType<Subtract<K, U>>;

type HOCProps<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  T extends WithStateMachineProps<TContext, TStateSchema, TEvent>
> = Subtract<T, WithStateMachineProps<TContext, TStateSchema, TEvent>>;

export type HOCWithStateMachineType<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  P extends WithStateMachineProps<TContext, TStateSchema, TEvent>
> = ComplexHOCType<WithStateMachineProps<TContext, TStateSchema, TEvent>, P>;


export interface WithStateMachineComponentState<TContext, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
}

export function withStateMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEvent extends EventObject,
  P extends WithStateMachineProps<TContext, TStateSchema, TEvent>
>(
  Comp: ComponentType<P>,
  machineConfig: MachineConfig<TContext, TStateSchema, TEvent>,
): HOCWithStateMachineType<TContext, TStateSchema, TEvent, P> {
  return class WithStateMachineComponent extends PureComponent<
    HOCProps<TContext, TStateSchema, TEvent, P>,
    WithStateMachineComponentState<TContext, TEvent>
  > {
    private machine: StateMachine<TContext, TStateSchema, TEvent>;
    private interpreter: Interpreter<TContext, TStateSchema, TEvent>;

    constructor(props: HOCProps<TContext, TStateSchema, TEvent, P>) {
      super(props);

      this.machine = Machine<TContext, TStateSchema, TEvent>(machineConfig);
      this.state = { machineState: this.machine.initialState };
      this.interpreter = interpret(this.machine).onTransition(this.onTransition);
    }

    componentDidMount(): void {
      this.interpreter.start();
    }

    componentWillUnmount(): void {
      this.interpreter.stop();
    }

    sendEvent = (event: TEvent): void => {
      const { send } = this.interpreter;
      send(event);
    };

    onTransition = (machineState: State<TContext, TEvent>): void => {
      this.setState({ machineState });
    };

    render(): ReactNode {
      const { machineState } = this.state;

      return <Comp sendEvent={this.sendEvent} machineState={machineState} machine={this.machine} {...this.props as P} />;
    }
  };
}
