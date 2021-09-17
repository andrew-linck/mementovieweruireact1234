import React from "react";
import AppBar from "@material-ui/core/AppBar";
import "./TopBar.css";
import _ from "lodash";

import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import StorageIcon from "@material-ui/icons/Storage";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import GpsNotFixedIcon from "@material-ui/icons/GpsNotFixed";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import StraightenIcon from "@material-ui/icons/Straighten";
import TabUnselectedIcon from "@material-ui/icons/TabUnselected";
import GridOnIcon from "@material-ui/icons/GridOn";
import EditLocationIcon from "@material-ui/icons/EditLocation";
import TimelineIcon from "@material-ui/icons/Timeline";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import BlurLinearIcon from "@material-ui/icons/BlurLinear";
import Box from "@material-ui/core/Box";

const buttons = [
  {
    title: "Show/Hide Servers and Layers",
    onClick: "show/hide",
    Icon: StorageIcon,
    placement: "bottom-start",
  },
  {
    title: "Previous Extent",
    onClick: "previous",
    Icon: NavigateBeforeIcon,
    placement: "bottom-start",
  },
  {
    title: "Next Extent",
    onClick: "next",
    Icon: NavigateNextIcon,
    placement: "bottom-start",
  },
  {
    title: "Toggle Map Neatlines",
    onClick: "neatlines_toggle",
    Icon: GridOnIcon,
    placement: "bottom-start",
  },
  {
    title: "Zoom To Selection",
    onClick: "zoom_to_selection",
    Icon: TabUnselectedIcon,
    placement: "bottom-start",
  },
  {
    title: "Track Current GPS Location",
    onClick: "track_gps",
    Icon: GpsNotFixedIcon,
    placement: "bottom-start",
  },
  {
    title: "Pan Around Map",
    onClick: "pan_mode",
    Icon: OpenWithIcon,
    placement: "bottom-start",
  },
  {
    title: "Measure A Length On The Map",
    onClick: "measure_length",
    Icon: StraightenIcon,
    placement: "bottom-start",
  },
  {
    title: "Measure An Area On The Map",
    onClick: "measure_area",
    Icon: BlurLinearIcon,
    placement: "bottom-start",
  },
  {
    title: "Search Location",
    onClick: "search_location",
    Icon: EditLocationIcon,
    placement: "bottom-start",
  },
  {
    title: 'Switch Between "USNG", "UTM", "DMS", "DM", and "Degrees"',
    onClick: "unit_switch",
    Icon: TimelineIcon,
    placement: "bottom-start",
  },
  {
    title: "Make Map Fullscreen",
    onClick: "full_screen",
    Icon: FullscreenIcon,
    placement: "bottom-start",
  },
];

export default function TopBar(props) {
  {
    /* Map over buttons array and return a button component for each item */
  }
  const canGoBack = props.previousExtent.length <= 1 ? true : false;
  const canGoForward = props.nextExtent.length <= 0 ? true : false;

  const Buttons = buttons.map(function (currentValue, index) {
    // for making the buttons change colors and disable (for extent)
    let isDisabled; // previous and next extent
    let neatLines;
    let zoomToSelection;
    let currLocation;
    let panMode;
    let measureLength;
    let measureArea;
    let searchLocation;
    let fullScreen;
    let drawer;

    if (currentValue.onClick == "previous" && canGoBack) {
      isDisabled = true;
    }
    if (currentValue.onClick == "next" && canGoForward) {
      isDisabled = true;
    }
    if (currentValue.onClick == "neatlines_toggle" && props.neatlinesOn) {
      neatLines = "primary";
    } else {
      neatLines = undefined;
    }
    if (
      currentValue.onClick == "zoom_to_selection" &&
      props.zoomToSelectionOn
    ) {
      zoomToSelection = "primary";
    } else {
      zoomToSelection = undefined;
    }
    if (currentValue.onClick == "track_gps" && props.currentLocationOn) {
      currLocation = "primary";
    } else {
      currLocation = undefined;
    }
    if (currentValue.onClick == "pan_mode" && props.panModeOn) {
      panMode = "primary";
    } else {
      panMode = undefined;
    }
    if (currentValue.onClick == "measure_length" && props.measureLengthOn) {
      measureLength = "primary";
    } else {
      measureLength = undefined;
    }
    if (currentValue.onClick == "measure_area" && props.measureAreaOn) {
      measureArea = "primary";
    } else {
      measureArea = undefined;
    }
    if (currentValue.onClick == "search_location" && props.searchLocationOn) {
      searchLocation = "primary";
    } else {
      searchLocation = undefined;
    }
    if (currentValue.onClick == "full_screen" && props.fullScreenOn) {
      fullScreen = "primary";
    } else {
      fullScreen = undefined;
    }
    if (currentValue.onClick == "show/hide" && props.drawerIsOpen) {
      drawer = "primary";
    } else {
      drawer = undefined;
    }
    if (isDisabled) {
      return (
        <Button
          key={index}
          variant="contained"
          id={currentValue.onClick}
          onClick={() => props.onClick(currentValue.onClick)}
          disabled={isDisabled}
        >
          <currentValue.Icon />
        </Button>
      );
    } else {
      return (
        <Tooltip
          key={index}
          title={currentValue.title}
          placement={currentValue.placement}
        >
          <Button
            key={index}
            variant="contained"
            id={currentValue.onClick}
            onClick={() => props.onClick(currentValue.onClick)}
            disabled={isDisabled}
          >
            <currentValue.Icon
              color={
                neatLines ||
                zoomToSelection ||
                currLocation ||
                panMode ||
                measureLength ||
                measureArea ||
                searchLocation ||
                fullScreen ||
                drawer
              }
            />
          </Button>
        </Tooltip>
      );
    }
  });

  return (
    <div className="topBar-container">
      <AppBar elevation={0} className="topBar-inner-container">
        <Box variant="contained">
          {/* Return the Buttons const which contains array of buttons */}
          {Buttons}
        </Box>
      </AppBar>
    </div>
  );
}
