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

```ts
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

```ts
export interface WithStateMachineProps<TContext, TEvent extends EventObject> {
  machineState: State<TContext, TEvent>;
  machineContext: TContext;
  machineEvent: OmniEventObject<TEvent>;
  sendEvent: (event: TEvent) => void;
  extendConfig: (opts: Partial<MachineOptions<TContext, TEvent>>, ctx?: TContext) => void;
}
```

# Example

Inside the repository you can find an example of the usage through the implementation of a xstate machine for toggling the visibility of a component and changing the text content of it. 
