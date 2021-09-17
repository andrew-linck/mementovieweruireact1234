import * as types from "./types";
import MementoViewerInternalClient from "../clients/memento_viewer_internal_client";

export const refresh_layers_for_server = (server, on_error) => async (
  dispatch,
  getState
) => {
  let name;
  let title;
  let extents;
  let layers;
  try {
    const mv = new MementoViewerInternalClient({ base_url: server });
    const res = await mv.layers();
    if (res.status !== "OK" || !res.layers) {
      throw new Error(res.message);
    }
    name = res.name;
    title = res.title;
    extents = res.extents;
    layers = res.layers;
  } catch (e) {
    const error = {
      type: types.ERROR_MESSAGE_SET,
      payload: {
        error: "VIEWER NOT STARTED",
        reason:
          "Memento Viewer has not been started, and therefore no data from it can be obtained and/or shown.",
      },
    };
    if (on_error) {
      if (!on_error()) {
        console.error(e);
        dispatch(error);
        return;
      }
    } else {
      console.error(e);
      dispatch(error);
      return;
    }
  }

  const action = {
    type: types.REFRESH_LAYERS_FOR_SERVER,
    payload: {
      server,
      name,
      title,
      extents,
      layers,
    },
  };
  dispatch(action);
};

export const refresh_layers_for_pdfs = (item) => async (dispatch, getState) => {
  dispatch({
    type: types.REFRESH_LAYERS_FOR_PDFS,
    payload: item,
  });
};
