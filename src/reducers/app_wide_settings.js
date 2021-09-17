import {
  TURN_NEATLINES_OFF,
  TURN_NEATLINES_ON,
  LEFT_DRAWER_CLOSE,
  LEFT_DRAWER_OPEN,
  LEFT_DRAWER_SET_CURRENT_TAB,
  LEFT_DRAWER_TRANSITIONING,
  LEFT_DRAWER_NOT_TRANSITIONING,
  NEXT_EXTENT,
  PREVIOUS_EXTENT,
  ADD_TO_HISTORY,
  ZOOM_TO_SELECTION_ON,
  ZOOM_TO_SELECTION_OFF,
  CURRENT_LOCATION_ON,
  CURRENT_LOCATION_OFF,
  PAN_MODE_ON,
  PAN_MODE_OFF,
  WINDOW_FULLSCREEN_ON,
  WINDOW_FULLSCREEN_OFF,
  MEASURE_LENGTH_ON,
  MEASURE_LENGTH_OFF,
  MEASURE_AREA_ON,
  MEASURE_AREA_OFF,
  SEARCH_LOCATION_ON,
  SEARCH_LOCATION_OFF,
  CHANGE_COORD_FORMAT,
  TRIGGER_MAP_MOVE,
  CLICKED,
  CYCLE_UNITS,
} from "../actions/types";

export const app_wide_settings = (state, action) => {
  if (state === undefined) {
    state = {
      neatlines: true,
      current_location: false,
      zoom_to_selection: false,
      measure_length: false,
      measure_area: false,
      full_screen: false,
      search_location: false,
      pan_mode: false,
      clicked_point: [],
      point_is_locked: false,
      coord_format: "Degrees",
      map_moving: false,
      is_open: true,
      current_tab: "layers",
      is_transitioning: false,
      transition_time: 750,
      previous_extent: [[180, 50, 0, 0]],
      next_extent: [],
    };
  }

  switch (action.type) {
    case TURN_NEATLINES_ON:
      {
        state = Object.assign({}, state, { neatlines: true });
      }
      break;

    case TURN_NEATLINES_OFF:
      {
        state = Object.assign({}, state, { neatlines: false });
      }
      break;

    case LEFT_DRAWER_CLOSE:
      {
        state = Object.assign({}, state, { is_open: false });
      }
      break;

    case LEFT_DRAWER_OPEN:
      {
        state = Object.assign({}, state, { is_open: true });
      }
      break;

    case LEFT_DRAWER_SET_CURRENT_TAB:
      {
        state = Object.assign({}, state, { current_tab: action.payload });
      }
      break;

    case LEFT_DRAWER_TRANSITIONING:
      {
        state = Object.assign({}, state, { is_transitioning: true });
      }
      break;

    case LEFT_DRAWER_NOT_TRANSITIONING:
      {
        state = Object.assign({}, state, { is_transitioning: false });
      }
      break;

    case PREVIOUS_EXTENT:
      {
        const theState = Object.assign({}, state);
        if (theState.previous_extent.length > 1) {
          theState.next_extent.unshift(theState.previous_extent.pop());
        }
        state = Object.assign({}, state, {
          next_extent: [...theState.next_extent],
        });
        state = Object.assign({}, state, {
          previous_extent: [...theState.previous_extent],
        });
        window.olMap
          .getView()
          .setCenter(
            state.previous_extent[state.previous_extent.length - 1].slice(0, 2)
          );
        window.olMap
          .getView()
          .setZoom(state.previous_extent[state.previous_extent.length - 1][2]);
        window.olMap
          .getView()
          .setRotation(
            state.previous_extent[state.previous_extent.length - 1][3]
          );
      }
      break;

    case NEXT_EXTENT:
      {
        const theState = Object.assign({}, state);
        theState.previous_extent.push(theState.next_extent.shift());
        state = Object.assign({}, state, {
          next_extent: [...theState.next_extent],
        });
        state = Object.assign({}, state, {
          previous_extent: [...theState.previous_extent],
        });
        window.olMap
          .getView()
          .setCenter(
            state.previous_extent[state.previous_extent.length - 1].slice(0, 2)
          );
        window.olMap
          .getView()
          .setZoom(state.previous_extent[state.previous_extent.length - 1][2]);
        window.olMap
          .getView()
          .setRotation(
            state.previous_extent[state.previous_extent.length - 1][3]
          );
      }
      break;

    case ADD_TO_HISTORY:
      {
        // only allow one with 180 as first item in index
        const theState = Object.assign({}, state);
        if (action.payload[0] !== 180) {
          theState.previous_extent.push(action.payload);
        }
        const uniqueExtent = Array.from(
          new Set(theState.previous_extent.map(JSON.stringify)),
          JSON.parse
        );
        state = Object.assign({}, state, {
          previous_extent: [...uniqueExtent],
        });
      }
      break;

    case ZOOM_TO_SELECTION_ON:
      {
        state = Object.assign({}, state, {
          zoom_to_selection: true,
          pan_mode: false,
          measure_length: false,
          measure_area: false,
          search_location: false,
        });
      }
      break;

    case ZOOM_TO_SELECTION_OFF:
      {
        state = Object.assign({}, state, {
          zoom_to_selection: false,
        });
      }
      break;

    case CURRENT_LOCATION_ON:
      {
        state = Object.assign({}, state, {
          current_location: true,
        });
      }
      break;

    case CURRENT_LOCATION_OFF:
      {
        state = Object.assign({}, state, {
          current_location: false,
        });
      }
      break;

    case PAN_MODE_ON:
      {
        state = Object.assign({}, state, {
          pan_mode: true,
          zoom_to_selection: false,
          measure_length: false,
          measure_area: false,
          search_location: false,
        });
      }
      break;

    case PAN_MODE_OFF:
      {
        state = Object.assign({}, state, {
          pan_mode: false,
        });
      }
      break;

    case MEASURE_LENGTH_ON:
      {
        state = Object.assign({}, state, {
          measure_length: true,
          measure_area: false,
          zoom_to_selection: false,
          search_location: false,
          pan_mode: false,
        });
      }
      break;

    case MEASURE_LENGTH_OFF:
      {
        state = Object.assign({}, state, {
          measure_length: false,
        });
      }
      break;

    case MEASURE_AREA_ON:
      {
        state = Object.assign({}, state, {
          measure_length: false,
          measure_area: true,
          zoom_to_selection: false,
          search_location: false,
          pan_mode: false,
        });
      }
      break;

    case MEASURE_AREA_OFF:
      {
        state = Object.assign({}, state, {
          measure_area: false,
        });
      }
      break;

    case SEARCH_LOCATION_ON:
      {
        state = Object.assign({}, state, {
          measure_length: false,
          measure_area: false,
          zoom_to_selection: false,
          search_location: true,
          pan_mode: false,
        });
      }
      break;

    case SEARCH_LOCATION_OFF:
      {
        state = Object.assign({}, state, {
          search_location: false,
        });
      }
      break;

    case WINDOW_FULLSCREEN_ON:
      {
        state = Object.assign({}, state, {
          full_screen: true,
        });
      }
      break;

    case WINDOW_FULLSCREEN_OFF:
      {
        state = Object.assign({}, state, {
          full_screen: false,
        });
      }
      break;

    case CHANGE_COORD_FORMAT:
      {
        if (state.coord_format == "Degrees") {
          state = Object.assign({}, state, {
            coord_format: "USNG",
          });
        } else if (state.coord_format == "USNG") {
          state = Object.assign({}, state, {
            coord_format: "UTM",
          });
        } else if (state.coord_format == "UTM") {
          state = Object.assign({}, state, {
            coord_format: "DMS",
          });
        } else if (state.coord_format == "DMS") {
          state = Object.assign({}, state, {
            coord_format: "DM",
          });
        } else if (state.coord_format == "DM") {
          state = Object.assign({}, state, {
            coord_format: "Degrees",
          });
        }
      }
      break;

    case TRIGGER_MAP_MOVE:
      state = Object.assign({}, state, {
        map_moving: action.payload,
      });
      break;

    case CLICKED:
      if (state.point_is_locked) {
        state = Object.assign({}, state, {
          point_is_locked: false,
        });
      } else {
        state = Object.assign({}, state, {
          clicked_point: action.payload,
          point_is_locked: true,
        });
      }
      break;

    case CYCLE_UNITS:
      state = Object.assign({}, state, {
        coord_format: "USNG",
      });
      setTimeout(
        (state = Object.assign({}, state, {
          coord_format: "UTM",
        })),
        1000
      );
      setTimeout(
        (state = Object.assign({}, state, {
          coord_format: "DMS",
        })),
        1000
      );
      setTimeout(
        (state = Object.assign({}, state, {
          coord_format: "DM",
        })),
        1000
      );
      setTimeout(
        (state = Object.assign({}, state, {
          coord_format: "Degrees",
        })),
        1000
      );
      break;

    default:
      break;
  }

  return state;
};
