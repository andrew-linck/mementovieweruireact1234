import React from "react";
import { connect } from "react-redux";
import { Map } from "../na_map";
import {
  add_to_history,
  search_location_off,
  trigger_map_move,
  context_menu_open,
  turn_neatlines_off,
  clicked,
  cycle_units,
} from "../actions";

function mapStateToProps(state) {
  return {
    previousExtent: state.app_wide_settings.previous_extent,
    nextExtent: state.app_wide_settings.next_extent,
    neatlines: state.app_wide_settings.neatlines,
    zoomToSelectionOn: state.app_wide_settings.zoom_to_selection,
    currentLocationOn: state.app_wide_settings.current_location,
    panModeOn: state.app_wide_settings.pan_mode,
    measureLengthOn: state.app_wide_settings.measure_length,
    measureAreaOn: state.app_wide_settings.measure_area,
    searchLocationOn: state.app_wide_settings.search_location,
    coordFormat: state.app_wide_settings.coord_format,
    mapMoving: state.app_wide_settings.map_moving,
    zoomFullExtent: state.context_menu_lite.show_full_extent,
    zoomOut: state.context_menu_lite.zoom_out,
    zoomIn: state.context_menu_lite.zoom_in,
    layers: state.servers,
    extent: state.app_wide_settings.previous_extent,
    pointIsLocked: state.app_wide_settings.point_is_locked,
  };
}

const mapDispatchToProps = {
  addToHistory: add_to_history,
  searchLocationOff: search_location_off,
  triggerMapMove: trigger_map_move,
  contextMenuOpen: context_menu_open,
  turnNeatLinesOff: turn_neatlines_off,
  clickedPoint: clicked,
  cycleUnits: cycle_units,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
