import {
  MachineConfig, State, StateSchema, assign, MachineOptions, EventObject, ActionObject,
} from 'xstate';

export enum AppMachineState {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE'
}

export enum AppMachineEvent {
  TOGGLE = 'TOGGLE',
  SET_TEXT = 'SET_TEXT'
}

export interface AppMachineToggleEvent {
  type: AppMachineEvent.TOGGLE;
}

export interface AppMachineSetTextEvent extends EventObject {
  type: AppMachineEvent.SET_TEXT;
  text: string;
}

export type AppMachineEventObject = AppMachineToggleEvent | AppMachineSetTextEvent;

export enum AppMachineAction {
  SET_TEXT = 'SET_TEXT',
  ON_SET_TEXT = 'ON_SET_TEXT'
}

export interface AppMachineContext {
  text: string;
}

export interface AppMachineStateSchema extends StateSchema {
  states: {
    [key in AppMachineState]: State<AppMachineContext, AppMachineEventObject>;
  };
  context: AppMachineContext;
}

export const appStateMachineConfig: MachineConfig<AppMachineContext, AppMachineStateSchema, AppMachineEventObject> = {
  initial: AppMachineState.VISIBLE,
  context: { text: 'I am a default text' },
  states: {
    [AppMachineState.HIDDEN]: {
      on: {
        [AppMachineEvent.TOGGLE]: { target: AppMachineState.VISIBLE },
        [AppMachineEvent.SET_TEXT]: { internal: true, actions: [AppMachineAction.SET_TEXT, AppMachineAction.ON_SET_TEXT] },
      },
    },
    [AppMachineState.VISIBLE]: {
      on: {
        [AppMachineEvent.TOGGLE]: { target: AppMachineState.HIDDEN },
        [AppMachineEvent.SET_TEXT]: { internal: true, actions: [AppMachineAction.SET_TEXT, AppMachineAction.ON_SET_TEXT] },
      },
    },
  },
};

const setTextAction: ActionObject<AppMachineContext, AppMachineSetTextEvent> = assign<AppMachineContext, AppMachineSetTextEvent>(
  (ctx: AppMachineContext, { text }: AppMachineSetTextEvent): AppMachineContext => ({ text }),
);

export const appStateMachineOptions: Partial<
MachineOptions<AppMachineContext, AppMachineEventObject>
> = { actions: { [AppMachineAction.SET_TEXT]: setTextAction } };
