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

const BaseComponent = (props: any) => <div {...props} />;
const WithStateMachineComponent = withStateMachine(BaseComponent, machineConfig, machineOptions);

let component: ShallowWrapper<WithStateMachineProps<any, any>, WithStateMachineComponentState<any, any>>;
let instance: any;

describe('withStateMachine', () => {
  beforeEach(() => {
    component = shallow<WithStateMachineProps<any, any>>(<WithStateMachineComponent inner-prop="inner-value" />);
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
      test('should call the withConfig method with the given opts and context', () => {
        const opts = {};
        const ctx = 'new-context';
        const mockWithConfig = instance.machine.withConfig;
        instance.extendConfig(opts, ctx);
        expect(mockWithConfig).toHaveBeenCalledWith(opts, ctx);
      });

      test('should call the withConfig method with the given opts and the current', () => {
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

  // extendConfig = (opts: Partial<MachineOptions<TContext, TEventObject>>, ctx?: TContext): void => {
  //   const { machineState: { context: oldContext } } = this.state;
  //   const context = ctx || oldContext;
  //   this.machine = this.machine.withConfig(opts, context);
  //   this.interpreter.stop();
  //   this.interpreter = interpret(this.machine).onTransition(this.onTransition);
  //   this.interpreter.start();
  // };

  // onTransition = (
  //   machineState: State<TContext, TEventObject>,
  //   machineEvent: OmniEventObject<TEventObject>,
  // ): void => this.setState({ machineState, machineEvent });

  // render(): ReactNode {
  //   const { machineState, machineEvent } = this.state;

  //   return (
  //     <Comp
  //       machineState={machineState}
  //       machineContext={machineState.context}
  //       machineEvent={machineEvent}
  //       sendEvent={this.sendEvent}
  //       extendConfig={this.extendConfig}

  //       {...this.props as P}
  //     />
  //   );
  // }
});
