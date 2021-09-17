import React, { Component } from "react";
import OLMap from "ol/Map";
import { transform } from "ol/proj";
import Projection from "ol/proj/Projection";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import WebGLPointsLayer from "ol/layer/WebGLPoints";
import View from "ol/View";
import ZoomSlider from "ol/control/ZoomSlider";
import ScaleLine from "ol/control/ScaleLine";
import clickedlocation from "./clickedlocation.svg";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import DragZoom from "ol/interaction/DragZoom";
import MousePosition from "ol/control/MousePosition";
import Draw from "ol/interaction/Draw";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import LineString from "ol/geom/LineString";
import ResizeObserver from "resize-observer-polyfill"; // Needed for Safari/IE
import "ol/ol.css";
import _ from "lodash";
import * as turf from "@turf/turf";
import axios from "axios";
import "./usng2";
import MapContextMenuWithData from "../MapContextMenuWithData";
import {
  copy_dms,
  copy_latlon,
  copy_usng,
  show_full_extent,
  zoom_out,
  zoom_in,
  open_pdf,
} from "../actions";
import {
  DMSFunction,
  LatLonFunction,
  USNGFunction,
  DMFunction,
  UTMFunction,
} from "./coordinates";

export const MapContext = React.createContext();

export class Map extends Component {
  constructor(props) {
    super(props);
    this.resizeObserver = null;
    this.resizeHandler = this.resizeHandler.bind(this);
    this.addOlLayer = this.addOlLayer.bind(this);
    this.removeOlLayer = this.removeOlLayer.bind(this);
    this.mapContainer = React.createRef();
    this.olLayers = {};
    this.olMap = null;
    this.contextMenu = false;
  }

  resizeHandler() {
    if (!!this.olMap && typeof this.olMap.updateSize === "function") {
      this.olMap.updateSize();
    }
  }

  componentDidMount() {
    this.props.cycleUnits();
    this.resizeObserver = new ResizeObserver(this.resizeHandler);
    this.resizeObserver.observe(this.mapContainer.current);
    this.props.addToHistory([180, 50, 0, 0]);

    this.normalizeLonLat = function (lonLat) {
      return _.map(lonLat, function (o) {
        return Math.abs((o + 180) % 360) - 180;
      });
    };

    this.vectorSource = new VectorSource({});
    window.vectorSource = this.vectorSource;

    this.olMap = new OLMap({
      target: this.mapContainer.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: window.vectorSource,
        }),
      ],
      view: new View({
        center: [180, 50],
        zoom: 0,
        rotation: 0,
      }),
    });

    window.olMap = this.olMap;

    this.icons = {
      symbol: {
        symbolType: "image",
        src: clickedlocation,
        size: [30, 30],
        color: "lightyellow",
        rotateWithView: false,
        offset: [0, 0],
      },
    };
    let pointLayer = new WebGLPointsLayer({
      name: "Clicked Layer",
      source: window.vectorSource,
      style: this.icons,
      disableHitDetection: true,
    });
    window.olMap.addLayer(pointLayer);

    // For Context Menu cleanup later
    this.olMap.on("pointermove", (e) => {
      this.llPoint = this.normalizeLonLat(e.coordinate);
      this.UTMPoint = UTMFunction(this.llPoint);
      this.DMPoint = DMFunction(this.llPoint);
      this.DMSPoint = DMSFunction(this.llPoint);
      this.USNGPoint = USNGFunction(this.llPoint);
      this.LatLonPoint = LatLonFunction(this.llPoint);
    });

    this.olMap.addInteraction(
      new DragZoom({
        condition: function (evt) {
          return false;
        },
      })
    );
    this.olMap.addControl(new ScaleLine());
    this.olMap.addControl(new ZoomSlider());

    //MESURING

    let lengthOf4326LineString = (line) => {
      if (line.length === 0) {
        return 0;
      }
      const lineString = turf.lineString(line);
      const length = turf.length(lineString, { untis: "kilometers" }) * 1000;
      return length;
    };
    // length
    let measureLengthFeature = null;
    this.measureLength = new Draw({
      source: window.vectorSource,
      type: "LineString",
    });
    this.measureLength.on("drawstart", function (evt) {
      measureLengthFeature = evt.feature;

      window.olMap.on("pointermove", () => {
        let lineString = measureLengthFeature
          .getGeometry()
          .clone()
          .transform("EPSG:3857", "EPSG:4326")
          .getCoordinates();
        let length = Math.round(lengthOf4326LineString(lineString) * 100) / 100;
        let output;
        if (length > 100) {
          output = Math.round((length / 1000) * 100) / 100 + " " + "km";
          console.log(output);
        } else {
          output = Math.round(length * 100) / 100 + " " + "m";
          console.log(output);
        }
        document.getElementById("measureNumber").innerHTML = output;
      });
    });
    // used to have drawend
    // area
    let measureAreaFeature = null;
    this.measureArea = new Draw({
      source: this.vectorSource,
      type: "Polygon",
    });
    this.measureArea.on("drawstart", function (evt) {
      measureAreaFeature = evt.feature;
      window.olMap.on("pointermove", () => {
        let polygon = measureAreaFeature.getGeometry();
        let google_ext = polygon.getExtent();
        var google_w = google_ext[2] - google_ext[0];
        var google_h = google_ext[3] - google_ext[1];

        let w_line = new LineString([
          [google_ext[0], google_ext[1]],
          [google_ext[2], google_ext[1]],
        ]);
        let h_line = new LineString([
          [google_ext[0], google_ext[1]],
          [google_ext[0], google_ext[3]],
        ]);
        let w_lineArray = w_line
          .transform("EPSG:3857", "EPSG:4326")
          .getCoordinates();
        let w_length =
          Math.round(lengthOf4326LineString(w_lineArray) * 100) / 100;

        let h_lineArray = h_line
          .transform("EPSG:3857", "EPSG:4326")
          .getCoordinates();
        let h_length =
          Math.round(lengthOf4326LineString(h_lineArray) * 100) / 100;
        let area = polygon.getArea();

        if (google_h !== 0 && google_w !== 0) {
          area = (((area * w_length) / google_w) * h_length) / google_h;
        }

        let output;

        if (area > 10000) {
          output =
            Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
        } else {
          output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
        }
        document.getElementById("measureNumber").innerHTML = output;
      });
    });

    setTimeout(() => {
      window.mpcontrol = new MousePosition({
        target: document.getElementById("mousePosition"),
        displayProjection: new Projection("EPSG:4326"),
        //prefix: '<input id="flyToBox" type="text" style="float: right" value="',
        //suffix: '">'
      });

      this.olMap.addControl(window.mpcontrol);
    }, 2000);

    this.olMap.on("movestart", () => {
      this.props.triggerMapMove(true);
    });

    this.olMap.on(
      "moveend",
      _.debounce(() => {
        const center = this.olMap.getView().getCenter();
        const zoom = this.olMap.getView().getZoom();
        const rotation = this.olMap.getView().getRotation();
        center.push(zoom);
        center.push(rotation);
        const extent = center;
        this.props.addToHistory(extent);
        this.props.triggerMapMove(false);
        // !!!!! Update center and zoom, if needed.
      }, 1000)
    );

    this.forceUpdate();
    //window.olMap = this.olMap; // For Debugging.
  }

  // Causing performance issues
  componentDidUpdate() {
    // this.olMap.getControls();
    const zoomToggle = this.props.zoomToSelectionOn;

    this.olMap.getInteractions().array_[9].condition_ = function (evt) {
      return zoomToggle;
    };

    if (this.props.measureLengthOn) {
      this.olMap.addInteraction(this.measureLength);
    } else {
      this.olMap.removeInteraction(this.measureLength);
    }

    if (this.props.measureAreaOn) {
      this.olMap.addInteraction(this.measureArea);
    } else {
      this.olMap.removeInteraction(this.measureArea);
    }
    this.degPoint = null;
    this.mgrs = null;
    this.DMS = null;

    if (this.props.mapMoving === false) {
      switch (this.props.coordFormat) {
        case "USNG":
          let llPointUSNG;
          document.getElementById("positionUnit").innerHTML = "USNG";
          this.olMap.on("pointermove", (e) => {
            llPointUSNG = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
            llPointUSNG = this.normalizeLonLat(llPointUSNG);
            var usng = new window.USNG2();
            var lonLat2 = { lon: llPointUSNG[0], lat: llPointUSNG[1] };
            this.mgrs = usng.fromLonLat(lonLat2);
            if (this.props.mapMoving === false) {
              document.getElementById("mousePosition").innerHTML = this.mgrs;
            }
          });
          this.olMap.on("click", (e) => {
            window.vectorSource.clear();
            document.getElementById("clickedPoint").innerHTML = this.mgrs;
            window.vectorSource.addFeature(
              new Feature({
                name: "Locked Point",
                geometry: new Point(e.coordinate, 30),
              })
            );
          });
          break;
        case "UTM":
          this.utm = null;
          let llPointUTM;
          document.getElementById("positionUnit").innerHTML = "UTM";
          this.olMap.on("pointermove", (e) => {
            llPointUTM = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
            llPointUTM = this.normalizeLonLat(llPointUTM);
            var usng = new window.USNG2();
            var lonLat2 = { lon: llPointUTM[0], lat: llPointUTM[1] };
            var mgrs = usng.fromLonLat(lonLat2);
            var utm_obj = usng.toUTM(mgrs);
            this.utm =
              mgrs.split(" ")[0] +
              " " +
              utm_obj.easting +
              "mE " +
              utm_obj.northing +
              "mN";
            if (this.props.mapMoving === false) {
              document.getElementById("mousePosition").innerHTML = this.utm;
            }
          });
          this.olMap.on("click", (e) => {
            window.vectorSource.clear();
            document.getElementById("clickedPoint").innerHTML = this.utm;
            window.vectorSource.addFeature(
              new Feature({
                name: "Locked Point",
                geometry: new Point(e.coordinate, 30),
              })
            );
          });
          break;
        case "DMS":
          let llPointDMS;
          document.getElementById("positionUnit").innerHTML = "DMS";
          this.olMap.on("pointermove", (e) => {
            llPointDMS = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
            llPointDMS = this.normalizeLonLat(llPointDMS);
            var lat = llPointDMS[1];
            var lon = llPointDMS[0];
            function dmsFromDegrees(degrees) {
              var x = Math.abs(Math.floor(3600 * degrees));
              var whole = Math.floor(x / 3600);
              var minutes = Math.floor((x / 60) % 60);
              var seconds = (Math.abs(degrees) - whole) * 3600 - minutes * 60;

              whole = whole.toString() + "\u00B0";

              while (whole.length < 4) {
                whole = "\u00A0" + whole;
              }

              minutes = minutes.toString() + "\u2032";

              while (minutes.length < 3) {
                minutes = "0" + minutes;
              }

              seconds = seconds.toFixed(1) + "\u2033";

              while (seconds.length < 5) {
                seconds = "0" + seconds;
              }

              return whole + minutes + seconds;
            }
            var latS = dmsFromDegrees(lat) + (lat < 0 ? "S" : "N");
            var lonS = dmsFromDegrees(lon) + (lon < 0 ? "W" : "E");
            this.DMS = latS + "\u00A0" + lonS;
            if (this.props.mapMoving === false) {
              document.getElementById("mousePosition").innerHTML = this.DMS;
            }
          });
          this.olMap.on("click", (e) => {
            window.vectorSource.clear();
            document.getElementById("clickedPoint").innerHTML = this.DMS;
            window.vectorSource.addFeature(
              new Feature({
                name: "Locked Point",
                geometry: new Point(e.coordinate, 30),
              })
            );
          });
          break;
        case "DM":
          this.DMPoint = null;
          let llPointDM;
          document.getElementById("positionUnit").innerHTML = "DM";
          this.olMap.on("pointermove", (e) => {
            llPointDM = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
            llPointDM = this.normalizeLonLat(llPointDM);
            var lat = llPointDM[1];
            var lon = llPointDM[0];
            function dmsFromDegrees(degrees) {
              var x = Math.abs(Math.floor(60000 * degrees));
              var whole = Math.floor(x / 60000);
              var minutes = Math.floor(x - whole * 60000) / 1000.0;

              whole = whole.toString() + "\u00B0";

              while (whole.length < 4) {
                whole = "\u00A0" + whole;
              }

              minutes = minutes.toFixed(3) + "\u2032";

              while (minutes.length < 7) {
                minutes = "0" + minutes;
              }

              return whole + minutes;
            }
            var latS = dmsFromDegrees(lat) + (lat < 0 ? "S" : "N");
            var lonS = dmsFromDegrees(lon) + (lon < 0 ? "W" : "E");
            this.DMPoint = latS + "\u00A0" + lonS;
            if (this.props.mapMoving === false) {
              document.getElementById("mousePosition").innerHTML = this.DMPoint;
            }
          });
          this.olMap.on("click", (e) => {
            window.vectorSource.clear();
            document.getElementById("clickedPoint").innerHTML = this.DMPoint;
            window.vectorSource.addFeature(
              new Feature({
                name: "Locked Point",
                geometry: new Point(e.coordinate, 30),
              })
            );
          });
          break;
        case "Degrees":
          let llPointDeg;
          document.getElementById("positionUnit").innerHTML = "Degrees";
          this.olMap.on("pointermove", (e) => {
            llPointDeg = transform(e.coordinate, "EPSG:3857", "EPSG:4326");
            llPointDeg = this.normalizeLonLat(llPointDeg);
            llPointDeg = [llPointDeg[0].toFixed(2), llPointDeg[1].toFixed(2)];
            this.degPoint = `${llPointDeg[0]}, ${llPointDeg[1]}`;
            if (this.props.mapMoving === false) {
              document.getElementById(
                "mousePosition"
              ).innerHTML = this.degPoint;
            }
          });
          this.olMap.on("click", (e) => {
            window.vectorSource.clear();
            document.getElementById("clickedPoint").innerHTML = this.degPoint;
            window.vectorSource.addFeature(
              new Feature({
                name: "Locked Point",
                geometry: new Point(e.coordinate, 30),
              })
            );
          });
          break;

        default:
          break;
      }
    }

    this.setCenter = (coords, map) => {
      axios
        .get(
          `http://www.mapquestapi.com/geocoding/v1/address?key=drIrNf3BiSVzvHcgYzgEeTn8EaMUkp0r&location=${coords}`
        )
        .then(function (response) {
          const latLng = response.data.results[0].locations[0].latLng;
          const llPoint = [latLng.lng, latLng.lat];
          let llPointChanged = transform(llPoint, "EPSG:4326", "EPSG:3857");
          map.getView().setCenter(llPointChanged);
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {});
    };

    if (this.props.searchLocationOn) {
      let coords = window.prompt(
        "Enter location (lon/lat, USNG or street address)",
        ""
      );
      this.setCenter(coords, this.olMap);
      this.props.searchLocationOff();
    }
  }

  addOlLayer(key, layer) {
    if (!!this.olLayers[key]) {
      throw new Error(`Error: OL layer with key ${key} already exists!`);
    }
    //console.log(`Adding OL layer ${key}`);
    this.olLayers[key] = layer;
    this.olMap.addLayer(layer);
  }

  removeOlLayer(key) {
    const layer = this.olLayers[key];
    if (!layer) {
      throw new Error(
        `Error: OL layer with key ${key} was not added to map, but an attempt was made to remove it!`
      );
    }
    //console.log(`Removing OL layer ${key}`);
    this.olMap.removeLayer(layer);
    delete this.olLayers[key];
  }

  render() {
    const value = {
      mapContainer: this.mapContainer.current,
      olMap: this.olMap,
      addOlLayer: this.addOlLayer,
      removeOlLayer: this.removeOlLayer,
    };

    const style = {
      width: "100%",
      height: "100%",
    };

    return (
      <MapContext.Provider value={value}>
        <div
          ref={this.mapContainer}
          style={style}
          onContextMenu={(e) => {
            e.preventDefault();
            this.props.contextMenuOpen(
              this.mapContainer.current,
              [
                {
                  label: "Copy DMS",
                  action: copy_dms(this.DMS),
                },
                {
                  label: "Copy Lat/Lon",
                  action: copy_latlon(this.degPoint),
                },
                { label: "Copy USNG", action: copy_usng(this.mgrs) },
                {
                  label: "Show Full Extent",
                  action: show_full_extent(this.olMap),
                },
                { label: "Zoom Out", action: zoom_out(this.olMap) },
                { label: "Zoom In", action: zoom_in(this.olMap) },
                {
                  label: "Open PDF",
                  action: open_pdf(
                    this.LatLonPoint,
                    this.props.layers[0].all_layer_keys,
                    this.props.extent
                  ),
                },
              ],
              [e.pageX, e.pageY]
            );
          }}
        >
          <MapContextMenuWithData />
          {value.olMap && this.props.children}
        </div>
        <input
          type="file"
          id="selectFile"
          acccept="application/pdf"
          style={{ display: "none" }}
          multiple
        ></input>
      </MapContext.Provider>
    );
  }
}
