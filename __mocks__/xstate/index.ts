export const Machine = () => ({
  initialState: {
    name: 'initial-state',
    event: 'initial-event',
    context: 'context',
  },
  withConfig: jest.fn().mockImplementation(() => {}),
});

const interpreter = {
  start: jest.fn().mockImplementation((): void => {}),
  stop: jest.fn().mockImplementation((): void => {}),
  send: jest.fn().mockImplementation((): void => {}),
};

export const mockOnTransition = jest.fn().mockReturnValue(interpreter);

export const interpret = jest.fn().mockReturnValue({ onTransition: mockOnTransition });
