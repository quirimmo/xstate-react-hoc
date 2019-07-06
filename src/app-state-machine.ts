import { EventObject, MachineConfig } from 'xstate';

export interface AppMachineStateSchema {
  states: {
    hidden: {};
    visible: {};
  };
  context: AppMachineContext;
}

export interface AppMachineEvent extends EventObject{
  type: 'TOGGLE';
}

export interface AppMachineContext {}

export const appStateMachineConfig: MachineConfig<AppMachineContext, AppMachineStateSchema, AppMachineEvent> = {
  initial: 'visible',
  context: {},
  states: {
    hidden: { on: { TOGGLE: { target: 'visible' } } },
    visible: { on: { TOGGLE: { target: 'hidden' } } },
  },
};
