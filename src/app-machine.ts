import { Machine } from 'xstate';

// This machine is completely decoupled from React
export const toggleMachine = Machine({
  id: 'toggle',
  initial: 'inactive',
  states: {
    inactive: { on: { TOGGLE: 'active', OTHER: 'other' } },
    other: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive', OTHER: 'other' } },
  },
});
