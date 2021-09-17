import { combineReducers } from "redux";
import { error_message } from "./error_message";
import { create_viewer_lite_dialog } from "./create_viewer_lite_dialog";
import { servers } from "./servers";
import { context_menu_lite } from "./context_menu_lite";
import { left_drawer } from "./left_drawer";
import { map_catalog } from "./map_catalog";
import { app_wide_settings } from "./app_wide_settings";

const reducers = combineReducers({
  app_wide_settings,
  context_menu_lite,
  create_viewer_lite_dialog,
  error_message,
  left_drawer,
  map_catalog,
  servers,
});

export default reducers;
