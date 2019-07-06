import { Machine, assign, EventObject } from 'xstate';

export interface AppMachineStateSchema {
  states: {
    inactive: {};
    other: {};
    active: {};
  };
  context: AppMachineContext;
}

export interface AppMachineEvent extends EventObject{
  type: 'TOGGLE' | 'OTHER' | string;
}

export interface AppMachineContext {
  test: string;
}

// This machine is completely decoupled from React
export const toggleMachine = Machine<AppMachineContext, AppMachineStateSchema, AppMachineEvent>({
  id: 'toggle',
  initial: 'inactive',
  context: { test: 'initial context' },
  states: {
    inactive: {
      on: {
        TOGGLE: {
          actions: [
            assign({ test: 'tua madre' }),
          ],
          target: 'active',
        },
        OTHER: {
          actions: [
            assign({ test: 'tua nonna' }),
          ],
          target: 'other',
        },
      },
    },
    other: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive', OTHER: 'other' } },
  },
});
