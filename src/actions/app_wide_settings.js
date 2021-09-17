import * as types from "./types";
import { sleep } from "../util";

const time_fudge = 100;

export const left_drawer_open = () => async (dispatch, getState) => {
  dispatch({
    type: types.LEFT_DRAWER_TRANSITIONING,
  });
  dispatch({
    type: types.LEFT_DRAWER_OPEN,
  });
  const state = getState();
  await sleep(state.app_wide_settings.transition_time + time_fudge);
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
  await sleep(state.app_wide_settings.transition_time + time_fudge);
  dispatch({
    type: types.LEFT_DRAWER_NOT_TRANSITIONING,
  });
};

export const left_drawer_set_current_tab = (tab) => {
  if (typeof tab !== "string") {
    throw new Error("Invalid parameters");
  }
  return {
    type: types.LEFT_DRAWER_SET_CURRENT_TAB,
    payload: tab,
  };
};

export const turn_neatlines_on = () => {
  return {
    type: types.TURN_NEATLINES_ON,
  };
};

export const turn_neatlines_off = () => {
  return {
    type: types.TURN_NEATLINES_OFF,
  };
};

export const previous_extent = () => {
  return {
    type: types.PREVIOUS_EXTENT,
  };
};

export const next_extent = () => {
  return {
    type: types.NEXT_EXTENT,
  };
};

export const add_to_history = (extent) => {
  return {
    type: types.ADD_TO_HISTORY,
    payload: extent,
  };
};

export const zoom_to_selection_on = () => {
  return {
    type: types.ZOOM_TO_SELECTION_ON,
  };
};

export const zoom_to_selection_off = () => {
  return {
    type: types.ZOOM_TO_SELECTION_OFF,
  };
};

export const current_location_on = () => {
  return {
    type: types.CURRENT_LOCATION_ON,
  };
};

export const current_location_off = () => {
  return {
    type: types.CURRENT_LOCATION_OFF,
  };
};

export const pan_mode_on = () => {
  return {
    type: types.PAN_MODE_ON,
  };
};

export const pan_mode_off = () => {
  return {
    type: types.PAN_MODE_OFF,
  };
};

export const measure_length_on = () => {
  return {
    type: types.MEASURE_LENGTH_ON,
  };
};

export const measure_length_off = () => {
  return {
    type: types.MEASURE_LENGTH_OFF,
  };
};

export const measure_area_on = () => {
  return {
    type: types.MEASURE_AREA_ON,
  };
};

export const measure_area_off = () => {
  return {
    type: types.MEASURE_AREA_OFF,
  };
};

export const search_location_on = () => {
  return {
    type: types.SEARCH_LOCATION_ON,
  };
};

export const search_location_off = () => {
  return {
    type: types.SEARCH_LOCATION_OFF,
  };
};

export const window_fullscreen_on = () => {
  var elem = document.querySelector("html");
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
  }
  openFullscreen();
  return {
    type: types.WINDOW_FULLSCREEN_ON,
  };
};

export const window_fullscreen_off = () => {
  var elem = document.querySelector("html");
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  closeFullscreen();
  return {
    type: types.WINDOW_FULLSCREEN_OFF,
  };
};

export const change_coord_format = () => {
  return {
    type: types.CHANGE_COORD_FORMAT,
  };
};

export const trigger_map_move = (isMoving) => {
  return {
    type: types.TRIGGER_MAP_MOVE,
    payload: isMoving,
  };
};

export const clicked = (point) => {
  return {
    type: types.CLICKED,
    payload: point,
  };
};

export const cycle_units = () => {
  return {
    type: types.CYCLE_UNITS,
  };
};
