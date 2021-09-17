import "./usng2";
import _ from "lodash";
import { transform } from "ol/proj";

const normalizeLonLat = function (lonLat) {
  return _.map(lonLat, function (o) {
    return Math.abs((o + 180) % 360) - 180;
  });
};

const USNGFunction = (coords) => {
  let llPoint = transform(coords, "EPSG:3857", "EPSG:4326");
  let normalizedPoints = normalizeLonLat(llPoint);
  var usng = new window.USNG2();
  var lonLat2 = { lon: normalizedPoints[0], lat: normalizedPoints[1] };
  var mgrs = usng.fromLonLat(lonLat2);
  return mgrs;
};

const UTMFunction = (coords) => {
  let llPoint = transform(coords, "EPSG:3857", "EPSG:4326");
  let normalizedPoints = normalizeLonLat(llPoint);
  var usng = new window.USNG2();
  var lonLat2 = { lon: normalizedPoints[0], lat: normalizedPoints[1] };
  var mgrs = usng.fromLonLat(lonLat2);
  var utm_obj = usng.toUTM(mgrs);
  let utm =
    mgrs.split(" ")[0] +
    " " +
    utm_obj.easting +
    "mE " +
    utm_obj.northing +
    "mN";
  return utm;
};

const DMSFunction = (coords) => {
  let llPoint = transform(coords, "EPSG:3857", "EPSG:4326");
  let normalizedPoints = normalizeLonLat(llPoint);
  var lat = normalizedPoints[1];
  var lon = normalizedPoints[0];
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
  let DMSString = latS + "\u00A0" + lonS;
  return DMSString;
};

const DMFunction = (coords) => {
  let llPoint = transform(coords, "EPSG:3857", "EPSG:4326");
  let normalizedPoints = normalizeLonLat(llPoint);
  var lat = normalizedPoints[1];
  var lon = normalizedPoints[0];
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
  let DMString = latS + "\u00A0" + lonS;
  return DMString;
};

const LatLonFunction = (coords) => {
  let llPoint = transform(coords, "EPSG:3857", "EPSG:4326");
  let normalizedPoints = normalizeLonLat(llPoint);
  normalizedPoints = [
    normalizedPoints[0].toFixed(2),
    normalizedPoints[1].toFixed(2),
  ];
  return `${normalizedPoints[0]}, ${normalizedPoints[1]}`;
};

export { USNGFunction, DMSFunction, LatLonFunction, UTMFunction, DMFunction };
