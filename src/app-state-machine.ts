import {
  MachineConfig,
  MachineOptions,
  State,
  StateSchema,
  StatesConfig,
  StateNodeConfig,
  assign,
  ActionObject,
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

export interface AppMachineSetTextEvent {
  type: AppMachineEvent.SET_TEXT;
  text: string;
}

export type AppMachineEventObject = AppMachineToggleEvent | AppMachineSetTextEvent;

export enum AppMachineAction {
  SET_TEXT = 'SET_TEXT'
}

export enum AppMachineCustomAction {
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

const initialContext: AppMachineContext = { text: 'I am a default text' };
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

export const appStateMachineConfig: MachineConfig<AppMachineContext, AppMachineStateSchema, AppMachineEventObject> = {
  initial: initialState,
  context: initialContext,
  states,
};

const setTextAction: ActionObject<AppMachineContext, AppMachineSetTextEvent> = assign<
  AppMachineContext,
  AppMachineSetTextEvent
>((ctx: AppMachineContext, { text }: AppMachineSetTextEvent): AppMachineContext => ({ text }));

export const appStateMachineOptions: Partial<
MachineOptions<AppMachineContext, AppMachineEventObject>
> = { actions: { [AppMachineAction.SET_TEXT]: setTextAction } };
