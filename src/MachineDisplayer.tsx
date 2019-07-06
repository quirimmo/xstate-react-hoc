import React, { ReactElement, FunctionComponent } from 'react';
import { StateValue } from 'xstate';
import { AppMachineContext } from './app-machine';

export interface MachineDisplayerProps {
  current: AppMachineContext;
  state: StateValue;
  onToggle: () => void;
  onOther: () => void;
}

export const MachineDisplayer: FunctionComponent<MachineDisplayerProps> = (props: MachineDisplayerProps): ReactElement => {
  const {
    current, state, onToggle, onOther,
  } = props;

  return (
    <div className="machine-dispayer">
      <div className="machine-dispayer__info">
        <h4>
        Current:
          <pre><code>{JSON.stringify(current)}</code></pre>
        </h4>
        <br />
        <h4>
        State:
          <pre><code>{JSON.stringify(state)}</code></pre>
        </h4>
      </div>
      <div className="machine-dispayer__actions">
        <button type="button" onClick={onToggle}>
          TOGGLE
        </button>
        <button type="button" onClick={onOther}>
          OTHER
        </button>
      </div>
    </div>
  );
};
