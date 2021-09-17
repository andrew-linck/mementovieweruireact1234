import * as types from './types';

export const error_message = (error) => ({
  type: types.ERROR_MESSAGE_SET,
  payload: {
    error: (error && error.error) || null,
    reason: (error && error.reason) || null,
    dismiss_label: (error && error.dismiss_label) || null,
  },
});

export const error_message_clear = () => ({
  type: types.ERROR_MESSAGE_CLEAR,
});
