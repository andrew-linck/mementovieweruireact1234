import * as types from "./types";
import _ from "lodash";
import axios from "axios";
import { transform } from "ol/proj";
import { toStringXY } from "ol/coordinate";
import { get } from "ol/proj";
import getPDFS from "../layers";

export const context_menu_open = (anchor_el, items, position) => {
  return {
    type: types.CONTEXT_MENU_OPEN,
    payload: {
      anchor_el,
      items,
      position,
    },
  };
};

export const context_menu_close = () => ({
  type: types.CONTEXT_MENU_CLOSE,
});

export const context_menu_click = (item_clicked) => (dispatch, getState) => {
  if (!item_clicked || !item_clicked.action) {
    throw new Error("Invalid parameters");
  }
  dispatch(item_clicked.action);
};

export const copy_dms = (dms) => {
  return {
    type: types.COPY_DMS,
    payload: dms,
  };
};

export const copy_latlon = (latlon) => {
  return {
    type: types.COPY_LATLON,
    payload: latlon,
  };
};

export const copy_usng = (usng) => {
  return {
    type: types.COPY_USNG,
    payload: usng,
  };
};

export const show_full_extent = (map) => (dispatch, getState) => {
  let store = getState();
  store.app_wide_settings.previous_extent.push([180, 50, 0, 0]);
  dispatch({
    type: types.SHOW_FULL_EXTENT,
    payload: map,
  });
};

export const zoom_out = (map) => (dispatch, getState) => {
  let store = getState();
  let previousExtent = store.app_wide_settings.previous_extent;
  let lastExtent = previousExtent[previousExtent.length - 1];
  let lastExtentZoomed = [
    lastExtent[0],
    lastExtent[1],
    lastExtent[2] - 0.5,
    lastExtent[3],
  ];
  store.app_wide_settings.previous_extent.push(lastExtentZoomed);
  let newZoom = lastExtent[2] - 0.5;
  dispatch({
    type: types.ZOOM_OUT,
    payload: { map, newZoom },
  });
};

export const zoom_in = (map) => (dispatch, getState) => {
  let store = getState();
  let previousExtent = store.app_wide_settings.previous_extent;
  let lastExtent = previousExtent[previousExtent.length - 1];
  let lastExtentZoomed = [
    lastExtent[0],
    lastExtent[1],
    lastExtent[2] + 0.5,
    lastExtent[3],
  ];
  store.app_wide_settings.previous_extent.push(lastExtentZoomed);
  let newZoom = lastExtent[2] + 0.5;
  dispatch({
    type: types.ZOOM_IN,
    payload: { map, newZoom },
  });
};

export const open_pdf = (point, layers, extent) => (dispatch, getState) => {
  // const tileUrlFunction = window.olSource.getTileUrlFunction();
  // const grid = window.olSource.getTileGrid();
  // const resolution = window.olMap.getView().getResolution();
  // const getZRes = grid.getZForResolution(resolution);
  // const tileCoord = grid.getTileCoordForCoordAndZ(point, getZRes);

  // let roundedCoord = [
  //   Math.round(tileCoord[0]),
  //   Math.round(tileCoord[1]),
  //   Math.round(tileCoord[2]),
  // ];
  let layersString = layers.join(",");
  layersString = encodeURIComponent(layersString);
  layersString = layersString.replace(/%2C/g, ",");

  let intViewportWidth = window.olMap.getSize()[0];
  let intViewportHeight = window.olMap.getSize()[1];
  let bbox = window.olMap.getView().calculateExtent();
  bbox = bbox.join(",");
  point = Array.from(point.split(","), Number);

  axios
    .get(
      `http://localhost:6003/memento/publisher/source/viewport?SRS=EPSG:3857&WIDTH=${intViewportWidth}&HEIGHT=${intViewportHeight}&BBOX=${bbox}&LAYERS=${layersString}&x=${point[0]}&y=${point[1]}`
    )
    .then((res) => {
      console.log(res);

      if (res.data.maps[0]) {
        window.open(
          `http://localhost:6003/memento/publisher/pdf/file/${res.data.maps[0].layer}/${res.data.maps[0].filename}`
        );
      }
      // NOT FOR NOW
      // let parser, xmlDoc;
      // parser = new DOMParser();
      // xmlDoc = parser.parseFromString(res.data, "text/xml");
      // const PDFS = xmlDoc.getElementsByTagName("Layer")[0];
      // console.log(xmlDoc);
      // const newllPoint = transform(point, "EPSG:3857", "EPSG:4326");
      // const layerName = getPDFS(PDFS, newllPoint);
      // var pdf;
      // if (layerName == "Iraq.ONC") {
      //   pdf = "ONCXXH06_geo.pdf";
      // } else if (layerName == "District_of_Columbia") {
      //   pdf = "1501ANJ1801_geo.pdf";
      // } else if (layerName == "GISWEB1.Parks.Maps and Brochures") {
      //   pdf = "BigRiversSummerTrailMap.pdf";
      // } else if (layerName == "Iraq.TPC") {
      //   pdf = "TPCXXH06B_geo.pdf";
      // } else if (layerName == "Ortho") {
      //   pdf = "15TVK8967-ortho.pdf";
      // } else if (layerName == "Utah") {
      //   pdf = "UT_Moab_20110324_TM_geo.pdf";
      // }
    });
  // window.open(tileUrlFunction(roundedCoord, 1, get("EPSG:3857")));
  dispatch({
    type: types.OPEN_PDF,
    payload: point,
  });
};
