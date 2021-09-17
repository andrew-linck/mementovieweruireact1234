import * as types from "./types";

export const map_catalog_remove_item = (highlightedItem) => {
  if (typeof highlightedItem !== "string") {
    throw new Error("Invalid parameters");
  }
  return {
    type: types.REMOVE_ITEM,
    payload: highlightedItem,
  };
};

export const map_catalog_open = () => {
  return {
    type: types.MAP_CATALOG_OPEN,
  };
};

export const map_catalog_close = () => {
  return {
    type: types.MAP_CATALOG_CLOSE,
  };
};

export const select_tree_item = (item) => async (dispatch, getState) => {
  let re = /[A-Z](.*)/;
  if (item == "http://localhost:6003/") {
    dispatch({
      type: types.SELECTED_ITEM,
      payload: "PDF Maps",
    });
  }
  let selected_item = re.exec(item) !== null ? re.exec(item)[0] : "None";
  dispatch({
    type: types.SELECTED_ITEM,
    payload: selected_item,
  });
};

export const insert_item = (item, element) => async (dispatch, getState) => {
  dispatch({
    type: types.INSERT_ITEM,
    payload: item,
    payload2: element,
  });
};

export const add_folder = (item, element) => async (dispatch, getState) => {
  dispatch({
    type: types.ADD_FOLDER,
    payload: item,
    payload2: element,
  });
};

export const add_pdf = (item, element) => async (dispatch, getState) => {
  dispatch({
    type: types.ADD_PDF,
    payload: item,
    payload2: element,
  });
};

export const select_pdf = (element) => async (dispatch) => {
  dispatch({
    type: types.SELECT_PDF,
    payload: element,
  });
};

export const remove_pdf = (layer, pdf) => async (dispatch) => {
  dispatch({
    type: types.REMOVE_PDF,
    payload: layer,
    payload2: pdf,
  });
};
