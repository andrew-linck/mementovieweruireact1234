import { ERROR_MESSAGE_SET, ERROR_MESSAGE_CLEAR } from "../actions/types";

export const error_message = (state, action) => {
  if (state === undefined) {
    state = null;
  }
  switch (action.type) {
    case ERROR_MESSAGE_CLEAR:
      {
        state = null;
      }
      break;

    case ERROR_MESSAGE_SET:
      {
        console.error(action.payload);
        state = {
          error: action.payload.error || "ERROR",
          reason: action.payload.reason || "An error has occurred!",
          dismiss_label: action.payload.dismiss_label || "DISMISS",
        };
      }
      break;

    default:
      break;
  }
  return state;
};
