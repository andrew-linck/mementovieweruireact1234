import React, { Component } from "react";
import "./ClickedPoint.css";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Typography from "@material-ui/core/Typography";
import clickedlocation from "./clickedlocation.svg";

export default class clickedPoint extends Component {
  render() {
    return (
      <>
        <img id="clickedPointImg" src={clickedlocation}></img>
        <Typography id="clickedPoint"></Typography>
      </>
    );
  }
}
