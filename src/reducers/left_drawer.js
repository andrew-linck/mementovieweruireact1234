import {
  LEFT_DRAWER_OPEN,
  LEFT_DRAWER_CLOSE,
  LEFT_DRAWER_SET_CURRENT_TAB,
  LEFT_DRAWER_TRANSITIONING,
  LEFT_DRAWER_NOT_TRANSITIONING,
} from '../actions/types';
  
export const left_drawer = (state, action) => {
  if (state === undefined) {
    state = {
      is_open: true,
      current_tab: 'layers',
      is_transitioning: false,
      transition_time: 750,
    }
  }
  return state;
};
  