import * as types from './types';

export const create_viewer_lite_dialog_open = () => ({
  type: types.CREATE_VIEWER_LITE_DIALOG_OPEN,
});

export const create_viewer_lite_dialog_close = () => ({
  type: types.CREATE_VIEWER_LITE_DIALOG_CLOSE,
});

export const create_viewer_lite_dialog_set_dir = (directory) => {
  if (
    typeof directory !== "object" ||
    typeof directory.directory !== "string"
  ) {
    throw new Error("Invalid parameters");
  }
  return {
    type: types.CREATE_VIEWER_LITE_DIALOG_SET_DIR,
    payload: {directory},
  }
};

export const create_viewer_lite_dialog_use_exe_subdir = (value) => {
  if (typeof value !== "boolean") {
    throw new Error("Invalid parameters");
  }
  return {
    type: value ?
      types.CREATE_VIEWER_LITE_DIALOG_USE_EXE_SUB_DIR :
      types.CREATE_VIEWER_LITE_DIALOG_DO_NOT_USE_EXE_SUB_DIR,
  }
};

export const create_viewer_lite_dialog_scan_dir = (value) => {
  if (typeof value !== "boolean") {
    throw new Error("Invalid parameters");
  }
  return {
    type: value ?
      types.CREATE_VIEWER_LITE_DIALOG_SCAN_DIR :
      types.CREATE_VIEWER_LITE_DIALOG_DO_NOT_SCAN_DIR,
  }
};
