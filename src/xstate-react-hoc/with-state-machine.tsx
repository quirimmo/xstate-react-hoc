import React, { PureComponent, ComponentType, ReactNode } from 'react';
import { Subtract } from 'utility-types';
import {
  ActionFunction,
  ActionObject,
  StateSchema,
  MachineConfig, EventObject, StateMachine, Machine,
  Interpreter, interpret, State, OmniEventObject, MachineOptions,
} from 'xstate';


export interface WithStateMachineProps<TContext, TEvent extends EventObject, TAction extends string> {
  machineState: State<TContext, TEvent>;
  machineContext: TContext;
  machineEvent: OmniEventObject<TEvent>;
  sendEvent: (event: TEvent) => void;
  addActions: (actions: Record<TAction, ActionObject<TContext, TEvent> | ActionFunction<TContext, TEvent>>) => void;
}

type ComplexHOCType<U extends object, K extends U> = ComponentType<Subtract<K, U>>;

export type HOCWithStateMachineType<
  TContext,
  TEvent extends EventObject,
  TAction extends string,
  P extends WithStateMachineProps<TContext, TEvent, TAction>
> = ComplexHOCType<WithStateMachineProps<TContext, TEvent, TAction>, P>;

type HOCProps<
  TContext,
  TEvent extends EventObject,
  TAction extends string,
  T extends WithStateMachineProps<TContext, TEvent, TAction>
> = Subtract<T, WithStateMachineProps<TContext, TEvent, TAction>>;

export interface WithStateMachineComponentState<TContext, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
  machineEvent: OmniEventObject<TEvent>;
}

export function withStateMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEventObject extends EventObject,
  TAction extends string,
  P extends WithStateMachineProps<TContext, TEventObject, TAction>
>(
  Comp: ComponentType<P>,
  machineConfig: MachineConfig<TContext, TStateSchema, TEventObject>,
  machineOptions?: Partial<MachineOptions<TContext, TEventObject>>,
): HOCWithStateMachineType<TContext, TEventObject, TAction, P> {
  return class WithStateMachineComponent extends PureComponent<
    HOCProps<TContext, TEventObject, TAction, P>,
    WithStateMachineComponentState<TContext, TEventObject>
  > {
    private machine: StateMachine<TContext, TStateSchema, TEventObject>;
    private interpreter: Interpreter<TContext, TStateSchema, TEventObject>;

    constructor(props: HOCProps<TContext, TEventObject, TAction, P>) {
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

    addActions = (actions: Record<string, ActionObject<TContext, TEventObject> | ActionFunction<TContext, TEventObject>>): void => {
      const { machineState: { context } } = this.state;

      this.machine = this.machine.withConfig({ actions }).withContext(context);
      this.interpreter.stop();
      this.interpreter = interpret(this.machine).onTransition(this.onTransition);
      this.interpreter.start();
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

          addActions={this.addActions}

          {...this.props as P}
        />
      );
    }
  };
}
