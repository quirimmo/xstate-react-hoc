# xstate-react-hoc

A React HOC for implementing xstate machines inside your react components.

![Travis (.org)](https://img.shields.io/travis/quirimmo/xstate-react-hoc?style=for-the-badge)

![Codecov](https://img.shields.io/codecov/c/github/quirimmo/xstate-react-hoc?style=for-the-badge)

![GitHub repo size](https://img.shields.io/github/repo-size/quirimmo/xstate-react-hoc?style=for-the-badge)

![NPM](https://img.shields.io/npm/l/xstate-react-hoc?style=for-the-badge)

![npm](https://img.shields.io/npm/v/xstate-react-hoc?style=for-the-badge)

![GitHub top language](https://img.shields.io/github/languages/top/quirimmo/xstate-react-hoc?style=for-the-badge)

![GitHub last commit](https://img.shields.io/github/last-commit/quirimmo/xstate-react-hoc?style=for-the-badge)


# Description 

The library aims to offer a React HOC in order to associate xstate machines with your React Component, injecting different `props` that can be used for interacting with xstate. 

# Usage

In order to create your HOC you can use the following function:

```typescript
function withStateMachine<
  TContext,
  TStateSchema extends StateSchema,
  TEventObject extends EventObject,
  P extends WithStateMachineProps<TContext, TEventObject>
>(
  Comp: ComponentType<P>,
  machineConfig: MachineConfig<TContext, TStateSchema, TEventObject>,
  machineOptions?: Partial<MachineOptions<TContext, TEventObject>>,
): HOCWithStateMachineType<TContext, TEventObject, P>
```

This HOC will inject the following props into the component:

```typescript
export interface WithStateMachineProps<TContext, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
  machineContext: TContext;
  machineEvent: OmniEventObject<TEvent>;
  sendEvent: (event: TEvent) => void;
  extendConfig: (opts: Partial<MachineOptions<TContext, TEvent>>, ctx?: TContext) => void;
}
```

# Example

Inside the repository on github, it is present a full example which shows how to create a custom xstate machine, for toggling visibility and changing content of components, plus how to inject it through the HOC to all the components, with then the implementation of the component for using the injected state machine context inside the component state.

As first thing, let's define what will be the states of our machine, for accomplishing the tasks described above: 
- Hiding/Showing
- Changing the content. 

We can then identify that our state machine should have two single states: 
- **Hidden**: From this state it reacts to two different events: 
  - **TOGGLE**: For being visible
  - **SET_TEXT**: For changing its content, because we may want that the content can change also when it is not visible, for showing then the different content when it will be visible again.
  If you want instead to not change the content when the component is not visible, you can not react on this event when the machine is in the Hidden state. 
- **Visible**: It reacts to the same events as above, in order to change the visibility and become hidden, and to change its content.

Let's define then two *Enums* which holds our states and our events, used for applyging a transition from one state into the other:

```typescript
export enum AppMachineState {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE'
}

export enum AppMachineEvent {
  TOGGLE = 'TOGGLE',
  SET_TEXT = 'SET_TEXT'
}
```

Let's then define the events that can be dispatched to this state machine.

In order to toggle the visibility, we do not need any other additional data to be passed to the machine, instead for setting the content we need to pass the new content that we want to set. 

We can then define the following interfaces representing our event objects, plus a generic interface for representing all the events of the machine:

```typescript
export interface AppMachineToggleEvent {
  type: AppMachineEvent.TOGGLE;
}

export interface AppMachineSetTextEvent {
  type: AppMachineEvent.SET_TEXT;
  text: string;
}

export type AppMachineEventObject = AppMachineToggleEvent | AppMachineSetTextEvent;
```

We can then define several actions that can be triggered in some cases, for executing any kind of side effects from the state machine. 

In this case, as example, let's define an action in order to trigger again the change of the content, plus an action that can be used as callback for when the content will be changed, and execute any custom action from outside.

We can split them up into two categoriews: 

- **Custom Actions**: Implemented from outside for executing custom code as side effect from the machine
- **Internal Actions**: Implemented inside the state machine for executing fixed side effects from the machine

```typescript
export enum AppMachineAction {
  SET_TEXT = 'SET_TEXT'
}

export enum AppMachineCustomAction {
  ON_SET_TEXT = 'ON_SET_TEXT'
}

```

Let's then design the context of this state machine. 

Being the visiblity expressed through the state, the only value that we store as context of the state machine, it is the current content that is dynamically changing through the machine.

We can define the following interface for the machine's context, and the following default initial value for it.

```typescript
export interface AppMachineContext {
  text: string;
}

const initialContext: AppMachineContext = { text: 'I am a default text' };
```

Once all the machine behavior has been designed, we can define the current State Schema for the machine:

```typescript
export interface AppMachineStateSchema extends StateSchema {
  states: {
    [key in AppMachineState]: State<AppMachineContext, AppMachineEventObject>;
  };
  context: AppMachineContext;
}
```


We can then define the states following the guidelines describe above: 

```typescript
const initialState: AppMachineState = AppMachineState.VISIBLE;

const setTextActions: string[] = [AppMachineAction.SET_TEXT, AppMachineCustomAction.ON_SET_TEXT];

const hiddenState: StateNodeConfig<
  AppMachineContext,
  AppMachineStateSchema['states'][AppMachineState.HIDDEN],
  AppMachineEventObject
> = {
  on: {
    [AppMachineEvent.TOGGLE]: { target: AppMachineState.VISIBLE },
    [AppMachineEvent.SET_TEXT]: {
      internal: true,
      actions: setTextActions,
    },
  },
};

const visibleState: StateNodeConfig<
  AppMachineContext,
  AppMachineStateSchema['states'][AppMachineState.VISIBLE],
  AppMachineEventObject
> = {
  on: {
    [AppMachineEvent.TOGGLE]: { target: AppMachineState.HIDDEN },
    [AppMachineEvent.SET_TEXT]: {
      internal: true,
      actions: setTextActions,
    },
  },
};

const states: StatesConfig<AppMachineContext, AppMachineStateSchema, AppMachineEventObject> = {
  [AppMachineState.HIDDEN]: hiddenState,
  [AppMachineState.VISIBLE]: visibleState,
};
```

Once all the above has been defined, we can finally create our state machine config:

```typescript
export const appStateMachineConfig: MachineConfig<AppMachineContext, AppMachineStateSchema, AppMachineEventObject> = {
  initial: initialState,
  context: initialContext,
  states,
};
```

The last thing that we need to create, it is the definition of the static action that we want as internal side effect for our state machine, and associate it to the current options of our state machine: 

```typescript
const setTextAction: ActionObject<AppMachineContext, AppMachineSetTextEvent> = assign<
  AppMachineContext,
  AppMachineSetTextEvent
>((ctx: AppMachineContext, { text }: AppMachineSetTextEvent): AppMachineContext => ({ text }));

export const appStateMachineOptions: Partial<
MachineOptions<AppMachineContext, AppMachineEventObject>
> = { actions: { [AppMachineAction.SET_TEXT]: setTextAction } };
```

This is all that we need from the state machine side, then we can pass now to see the code we neeed to implement for the component, in order to react dynamically to this state machine. 

```typescript
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
```

The code should be really familiar to all the React developers, because there is a base component which has the props injected through the HOC ***withStateMachine***, which as you can see takes as input the base component, the machine config, and the machine options. 

Through the injected prop, you can have the component that can dynamically react to the state machine changes, and triggerer changes directly to the state machines.



