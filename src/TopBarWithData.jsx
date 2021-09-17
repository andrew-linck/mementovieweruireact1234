import React from "react";
import TopBar from "./TopBar";
import { connect } from "react-redux";
import { transform } from "ol/proj";
import Feature from "ol/Feature";
import axios from "axios";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import pin from "./pin.svg";
import {
  DMSFunction,
  LatLonFunction,
  USNGFunction,
  DMFunction,
  UTMFunction,
} from "./na_map/coordinates";
import Point from "ol/geom/Point";
import PropTypes from "prop-types";
import {
  left_drawer_open,
  left_drawer_close,
  turn_neatlines_on,
  turn_neatlines_off,
  error_message,
  previous_extent,
  next_extent,
  zoom_to_selection_on,
  zoom_to_selection_off,
  current_location_on,
  current_location_off,
  pan_mode_on,
  pan_mode_off,
  measure_length_on,
  measure_length_off,
  measure_area_on,
  measure_area_off,
  search_location_on,
  search_location_off,
  window_fullscreen_on,
  window_fullscreen_off,
  change_coord_format,
} from "./actions";

const TopBarWithLogic = (props) => (
  <TopBar
    onClick={(key) => handleClick(key, props)}
    drawerIsOpen={props.drawerIsOpen}
    drawerIsTransitioning={props.drawerIsTransitioning}
    previousExtent={props.previousExtent}
    nextExtent={props.nextExtent}
    neatlinesOn={props.neatlinesOn}
    zoomToSelectionOn={props.zoomToSelectionOn}
    currentLocationOn={props.currentLocationOn}
    panModeOn={props.panModeOn}
    measureLengthOn={props.measureLengthOn}
    measureAreaOn={props.measureAreaOn}
    searchLocationOn={props.searchLocationOn}
    fullScreenOn={props.fullScreenOn}
  />
);

function handleClick(key, props) {
  switch (key) {
    case "show/hide":
      if (props.drawerIsOpen) {
        props.left_drawer_close();
      } else {
        props.left_drawer_open();
      }
      break;

    case "full_screen":
      if (props.fullScreenOn) {
        props.window_fullscreen_off();
      } else {
        props.window_fullscreen_on();
      }
      break;

    case "neatlines_toggle":
      if (props.neatlinesOn) {
        props.turn_neatlines_off();
      } else {
        props.turn_neatlines_on();
      }
      break;

    case "previous":
      if (props.previousExtent.length > 1) {
        props.previous_extent();
      }
      break;

    case "next":
      props.next_extent();
      break;

    case "zoom_to_selection":
      if (props.zoomToSelectionOn) {
        props.zoom_to_selection_off();
      } else {
        props.zoom_to_selection_on();
      }
      break;

    case "track_gps":
      if (props.currentLocationOn) {
        props.current_location_off();
      } else {
        window.vectorSource.clear();
        axios
          .get("https://jsonplaceholder.typicode.com/todos/1")
          .then(() => {
            navigator.geolocation.getCurrentPosition((loc) => {
              let llPoint = transform(
                [loc.coords.longitude, loc.coords.latitude],
                "EPSG:4326",
                window.olMap.getView().getProjection()
              );
              window.olMap.getView().setCenter(llPoint);
              window.olMap.getView().setZoom(15);
              window.vectorSource.addFeature(
                new Feature({
                  name: "Current Location",
                  geometry: new Point(llPoint, 30),
                })
              );
              switch (props.coordFormat) {
                case "USNG":
                  llPoint = USNGFunction(llPoint);
                  break;
                case "UTM":
                  llPoint = UTMFunction(llPoint);
                  break;
                case "DMS":
                  llPoint = DMSFunction(llPoint);
                  break;
                case "DM":
                  llPoint = DMFunction(llPoint);
                  break;
                case "Degrees":
                  llPoint = LatLonFunction(llPoint);
                  break;

                default:
                  break;
              }

              document.getElementById("clickedPoint").innerHTML = llPoint;
            });
          })
          .catch((err) => {
            alert(err);
          });

        props.current_location_on();
      }
      break;

    case "pan_mode":
      if (props.panModeOn) {
        props.pan_mode_off();
      } else {
        props.pan_mode_on();
      }
      break;

    case "measure_length":
      if (props.measureLengthOn) {
        props.measure_length_off();
      } else {
        props.measure_length_on();
      }
      break;

    case "measure_area":
      if (props.measureAreaOn) {
        props.measure_area_off();
      } else {
        props.measure_area_on();
      }
      break;

    case "search_location":
      if (props.searchLocationOn) {
        props.search_location_off();
      } else {
        props.search_location_on();
      }
      break;

    case "unit_switch":
      props.change_coord_format();
      break;

    default:
      props.error_message({
        error: "UNKNOWN BUTTON",
        reason: "A button was pressed with no handler attached.",
      });
      break;
  }
}

function mapStateToProps(state) {
  return {
    drawerIsOpen: state.app_wide_settings.is_open,
    drawerIsTransitioning: state.app_wide_settings.is_transitioning,
    fullScreenOn: state.app_wide_settings.full_screen,
    neatlinesOn: state.app_wide_settings.neatlines,
    previousExtent: state.app_wide_settings.previous_extent,
    nextExtent: state.app_wide_settings.next_extent,
    zoomToSelectionOn: state.app_wide_settings.zoom_to_selection,
    currentLocationOn: state.app_wide_settings.current_location,
    panModeOn: state.app_wide_settings.pan_mode,
    measureLengthOn: state.app_wide_settings.measure_length,
    measureAreaOn: state.app_wide_settings.measure_area,
    searchLocationOn: state.app_wide_settings.search_location,
    coordFormat: state.app_wide_settings.coord_format,
  };
}

const mapDispatchToProps = {
  left_drawer_open,
  left_drawer_close,
  turn_neatlines_on,
  turn_neatlines_off,
  error_message,
  previous_extent,
  next_extent,
  zoom_to_selection_on,
  zoom_to_selection_off,
  current_location_on,
  current_location_off,
  pan_mode_on,
  pan_mode_off,
  measure_length_on,
  measure_length_off,
  measure_area_on,
  measure_area_off,
  search_location_on,
  search_location_off,
  window_fullscreen_on,
  window_fullscreen_off,
  change_coord_format,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBarWithLogic);
