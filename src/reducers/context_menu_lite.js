import {
  CONTEXT_MENU_OPEN,
  CONTEXT_MENU_CLOSE,
  COPY_DMS,
  COPY_LATLON,
  COPY_USNG,
  SHOW_FULL_EXTENT,
  ZOOM_OUT,
  ZOOM_IN,
  OPEN_PDF,
} from "../actions/types";
// import { Map } from "../na_map";

export const context_menu_lite = (state, action) => {
  if (state === undefined) {
    state = {
      anchor_el: null,
      items: [],
      positionX: null,
      positionY: null,
    };
  }
  switch (action.type) {
    case CONTEXT_MENU_CLOSE:
      {
        state = {
          anchor_el: null,
          items: null,
          positionX: null,
          positionY: null,
          show_full_extent: false,
          zoom_out: false,
          zoom_in: false,
        };
      }
      break;

    case CONTEXT_MENU_OPEN:
      {
        const anchor_el = action.payload.anchor_el;
        const items = action.payload.items;
        const positionX = action.payload.position[0];
        const positionY = action.payload.position[1];
        // if (state !== null) {
        //   // Only 1 context menu can be active at a time, and if 1 is already
        //   // active, then any others must wait until it is closed.
        //   return;
        // }
        state = {
          anchor_el,
          items,
          positionX,
          positionY,
          show_full_extent: false,
          zoom_out: false,
          zoom_in: false,
        };
      }
      break;

    case COPY_DMS:
      {
        window.prompt("Hit Ctrl + C DMS", action.payload);
      }
      break;
    case COPY_USNG:
      {
        window.prompt("Hit Ctrl + C Copy DMS", action.payload);
      }
      break;
    case COPY_LATLON:
      {
        window.prompt("Hit Ctrl + C Copy DMS", action.payload);
      }
      break;
    case SHOW_FULL_EXTENT:
      {
        let map = action.payload;
        map.getView().setCenter([180, 50]);
        map.getView().setZoom(0);
        map.getView().setRotation(0);
      }
      break;
    case ZOOM_OUT:
      {
        let map = action.payload.map;
        map.getView().setZoom(action.payload.newZoom);
      }
      break;
    case ZOOM_IN:
      {
        let map = action.payload.map;
        map.getView().setZoom(action.payload.newZoom);
      }
      break;
    case OPEN_PDF:
      {
      }
      break;

    default:
      break;
  }
  return state;
};
