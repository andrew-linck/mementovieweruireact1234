import * as types from './types';

export const expand_server = (server_id, value) => {
  if (
    typeof server_id !== "string" ||
    typeof value !== "boolean"
  ) {
    throw new Error("Missing parameter");
  }
  return {
    type: types.EXPAND_SERVER,
    payload: {
      server_id,
      value,
    }
  };
};

export const expand_folder = (server_id, node_id, value) => {
  if (
    typeof server_id !== "string" ||
    typeof node_id !== "string" ||
    typeof value !== "boolean"
  ) {
    throw new Error("Missing parameter");
  }
  return {
    type: types.EXPAND_FOLDER,
    payload: {
      server_id,
      node_id,
      value,
    }
  };
};

export const activate_server = (server_id, value) => {
  if (
    typeof server_id !== "string" ||
    typeof value !== "boolean"
  ) {
    throw new Error("Missing parameter");
  }
  return {
    type: types.ACTIVATE_SERVER,
    payload: {
      server_id,
      value,
    }
  };
};

export const activate_folder_or_layer = (server_id, node_id, value) => {
  if (
    typeof server_id !== "string" ||
    typeof node_id !== "string" ||
    typeof value !== "boolean"
  ) {
    throw new Error("Missing parameter");
  }
  return {
    type: types.ACTIVATE_FOLDER_OR_LAYER,
    payload: {
      server_id,
      node_id,
      value,
    }
  };
};
