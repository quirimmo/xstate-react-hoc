import React, { PureComponent, ComponentType, ReactNode } from 'react';
import { Subtract } from 'utility-types';
import {
  StateSchema,
  MachineConfig, EventObject, StateMachine, Machine,
  Interpreter, interpret, State, OmniEventObject, MachineOptions,
} from 'xstate';


export interface WithStateMachineProps<TContext, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
  machineContext: TContext;
  machineEvent: OmniEventObject<TEvent>;
  sendEvent: (event: TEvent) => void;
}

type ComplexHOCType<U extends object, K extends U> = ComponentType<Subtract<K, U>>;

export type HOCWithStateMachineType<
  TContext,
  TEvent extends EventObject,
  P extends WithStateMachineProps<TContext, TEvent>
> = ComplexHOCType<WithStateMachineProps<TContext, TEvent>, P>;

type HOCProps<
  TContext,
  TEvent extends EventObject,
  T extends WithStateMachineProps<TContext, TEvent>
> = Subtract<T, WithStateMachineProps<TContext, TEvent>>;

export interface WithStateMachineComponentState<TContext, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
  machineEvent: OmniEventObject<TEvent>;
}

export function withStateMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEventObject extends EventObject,
  P extends WithStateMachineProps<TContext, TEventObject>
>(
  Comp: ComponentType<P>,
  machineConfig: MachineConfig<TContext, TStateSchema, TEventObject>,
  machineOptions?: Partial<MachineOptions<TContext, TEventObject>>,
): HOCWithStateMachineType<TContext, TEventObject, P> {
  return class WithStateMachineComponent extends PureComponent<
    HOCProps<TContext, TEventObject, P>,
    WithStateMachineComponentState<TContext, TEventObject>
  > {
    private machine: StateMachine<TContext, TStateSchema, TEventObject>;
    private interpreter: Interpreter<TContext, TStateSchema, TEventObject>;

    constructor(props: HOCProps<TContext, TEventObject, P>) {
      super(props);

      this.machine = Machine<TContext, TStateSchema, TEventObject>(machineConfig, machineOptions);
      this.state = {
        machineState: this.machine.initialState,
        machineEvent: this.machine.initialState.event,
      };
      this.interpreter = interpret(this.machine).onTransition(this.onTransition);
    }

    componentDidMount(): void {
      this.interpreter.start();
    }

    componentWillUnmount(): void {
      this.interpreter.stop();
    }

    sendEvent = (event: TEventObject): void => {
      const { send } = this.interpreter;
      send(event);
    };

    onTransition = (
      machineState: State<TContext, TEventObject>,
      machineEvent: OmniEventObject<TEventObject>,
    ): void => {
      this.setState({
        machineState,
        machineEvent,
      });
    };

    render(): ReactNode {
      const { machineState, machineEvent } = this.state;

      return (
        <Comp
          machineState={machineState}
          machineContext={machineState.context}
          machineEvent={machineEvent}

          sendEvent={this.sendEvent}

          {...this.props as P}
        />
      );
    }
  };
}
