import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { withStateMachine, WithStateMachineProps, WithStateMachineComponentState } from '../lib/with-state-machine';
import { interpret, mockOnTransition } from '../../__mocks__/xstate/index';

const machineConfig: any = {
  initialState: {
    name: 'initial-state',
    event: 'initial-event',
    context: 'context',
  },
  withConfig: expect.any(Function),
};
const machineOptions: any = {};

const BaseComponent = (props: any) => <div id="base-component" {...props} />;
const WithStateMachineComponent = withStateMachine(BaseComponent, machineConfig, machineOptions);

let component: ShallowWrapper<WithStateMachineProps<any, any>, WithStateMachineComponentState<any, any>>;
let instance: any;

describe('withStateMachine', () => {
  beforeEach(() => {
    component = shallow<WithStateMachineProps<any, any>>(<WithStateMachineComponent innerProp="inner-value" />);
    instance = component.instance();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should be rendered', () => {
    expect(component.exists()).toBeTruthy();
  });

  describe('init', () => {
    test('should set the machineState property of the state to the initial state of the machine', () => {
      expect(component.state().machineState).toEqual({ name: 'initial-state', event: 'initial-event', context: 'context' });
    });

    test('should set the machineEvent property of the state to the initial event of the machine', () => {
      expect(component.state().machineEvent).toEqual('initial-event');
    });

    test('should call the interpret method', () => {
      expect(interpret).toHaveBeenCalledWith(machineConfig);
    });

    test('should call the onTransition method of the interpret', () => {
      expect(mockOnTransition).toHaveBeenCalledWith(instance.onTransition);
    });

    test('should start the interpreter', () => {
      expect(instance.interpreter.start).toHaveBeenCalled();
    });
  });

  describe('componentWillUnmount', () => {
    test('should stop the interpreter', () => {
      component.unmount();
      expect(instance.interpreter.stop).toHaveBeenCalled();
    });
  });

  describe('sendEvent', () => {
    test('should send the event', () => {
      instance.sendEvent('event');
      expect(instance.interpreter.send).toHaveBeenCalledWith('event');
    });
  });

  describe('extendConfig', () => {
    test('should send the event', () => {
      instance.sendEvent('event');
      expect(instance.interpreter.send).toHaveBeenCalledWith('event');
    });
  });

  describe('extendConfig', () => {
    describe('withConfig', () => {
      test('should call the withConfig method with the given opts and the given context', () => {
        const opts = {};
        const ctx = 'new-context';
        const mockWithConfig = instance.machine.withConfig;
        instance.extendConfig(opts, ctx);
        expect(mockWithConfig).toHaveBeenCalledWith(opts, ctx);
      });

      test('should call the withConfig method with the given opts and the current context', () => {
        const opts = {};
        const mockWithConfig = instance.machine.withConfig;
        instance.extendConfig(opts);
        expect(mockWithConfig).toHaveBeenCalledWith(opts, 'context');
      });
    });

    describe('interpreter', () => {
      test('should stop the interpreter', () => {
        const opts = {};
        instance.extendConfig(opts);
        expect(instance.interpreter.stop).toHaveBeenCalled();
      });

      test('should start the interpreter', () => {
        const opts = {};
        instance.extendConfig(opts);
        expect(instance.interpreter.start).toHaveBeenCalled();
      });
    });
  });

  describe('onTransition', () => {
    test('should set the state', () => {
      jest.spyOn(instance, 'setState').mockImplementation(() => {});
      const machineState = 'machine-state';
      const machineEvent = 'machine-event';
      instance.onTransition(machineState, machineEvent);
      expect(instance.setState).toHaveBeenLastCalledWith({ machineState, machineEvent });
    });
  });

  describe('render', () => {
    let baseComponent: ShallowWrapper;

    beforeEach(() => {
      baseComponent = component.find(BaseComponent);
    });

    it('should render the inner component', () => {
      expect(baseComponent.exists()).toBeTruthy();
    });

    test('should add the machineState prop to the given component', () => {
      expect(baseComponent.prop('machineState')).toEqual(machineConfig.initialState);
    });

    test('should add the machineContext prop to the given component', () => {
      expect(baseComponent.prop('machineContext')).toEqual(machineConfig.initialState.context);
    });

    test('should add the machineEvent prop to the given component', () => {
      expect(baseComponent.prop('machineEvent')).toEqual(machineConfig.initialState.event);
    });

    test('should add the sendEvent prop to the given component', () => {
      expect(baseComponent.prop('sendEvent')).toEqual(instance.sendEvent);
    });

    test('should add the extendConfig prop to the given component', () => {
      expect(baseComponent.prop('extendConfig')).toEqual(instance.extendConfig);
    });

    test('should keep the original props of the given component', () => {
      expect(baseComponent.prop('innerProp')).toEqual('inner-value');
    });
  });
});
