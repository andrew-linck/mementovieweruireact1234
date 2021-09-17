import {
  CREATE_VIEWER_LITE_DIALOG_OPEN,
  CREATE_VIEWER_LITE_DIALOG_CLOSE,
  CREATE_VIEWER_LITE_DIALOG_SET_DIR,
  CREATE_VIEWER_LITE_DIALOG_USE_EXE_SUB_DIR,
  CREATE_VIEWER_LITE_DIALOG_DO_NOT_USE_EXE_SUB_DIR,
  CREATE_VIEWER_LITE_DIALOG_SCAN_DIR,
  CREATE_VIEWER_LITE_DIALOG_DO_NOT_SCAN_DIR,
} from '../actions/types';
import { os_name } from '../util';

export const create_viewer_lite_dialog = (state, action) => {
  const default_directory = os_name() === "Windows" ?
    "C:/viewer_lite" :
    "/viewer_lite";

  if (state === undefined) {
    state = {
      is_open: false,
      directory: default_directory,
      use_exe_sub_dir: true,
      scan_dir: true,
    };
  }
  switch (action.type) {
    case CREATE_VIEWER_LITE_DIALOG_CLOSE: {
      state = Object.assign({}, state, {is_open: false});
    } break;

    case CREATE_VIEWER_LITE_DIALOG_OPEN: {
      state = Object.assign({}, state, {is_open: true});
    } break;

    case CREATE_VIEWER_LITE_DIALOG_SET_DIR: {
      state = Object.assign({}, state, {
        directory: action.payload.directory.directory
      });
    } break;

    case CREATE_VIEWER_LITE_DIALOG_USE_EXE_SUB_DIR: {
      state = Object.assign({}, state, {use_exe_sub_dir: true});
    } break;

    case CREATE_VIEWER_LITE_DIALOG_DO_NOT_USE_EXE_SUB_DIR: {
      state = Object.assign({}, state, {use_exe_sub_dir: false});
    } break;

    case CREATE_VIEWER_LITE_DIALOG_SCAN_DIR: {
      state = Object.assign({}, state, {scan_dir: true});
    } break;

    case CREATE_VIEWER_LITE_DIALOG_DO_NOT_SCAN_DIR: {
      state = Object.assign({}, state, {scan_dir: false});
    } break;

    default: break;
  }
  return state;
};
