import * as types from './types';
import { sleep } from '../util';

const time_fudge = 100;

export const left_drawer_open = () => async (dispatch, getState) => {
  dispatch({
    type: types.LEFT_DRAWER_TRANSITIONING,
  });
  dispatch({
    type: types.LEFT_DRAWER_OPEN,
  });
  const state = getState();
  await sleep(state.left_drawer.transition_time + time_fudge);
  dispatch({
    type: types.LEFT_DRAWER_NOT_TRANSITIONING,
  });
};

export const left_drawer_close = () => async (dispatch, getState) => {
  dispatch({
    type: types.LEFT_DRAWER_TRANSITIONING,
  });
  dispatch({
    type: types.LEFT_DRAWER_CLOSE,
  });
  const state = getState();
  await sleep(state.left_drawer.transition_time + time_fudge);
  dispatch({
    type: types.LEFT_DRAWER_NOT_TRANSITIONING,
  });
};

export const left_drawer_set_current_tab = (tab) => {
  if (typeof tab !== 'string') {
    throw new Error("Invalid parameters");
  }
  return {
    type: types.LEFT_DRAWER_SET_CURRENT_TAB,
    payload: tab,
  }
};
