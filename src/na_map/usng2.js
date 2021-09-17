/*
 * Library to convert between NAD83 Lat/Lon and US National Grid
 * Maintained at https://github.com/klassenjs/usng_tools
 *
 * License:
 *
 * Copyright (c) 2008-2013 James Klassen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies of this Software or works derived from this Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/* TODO: Norway and others odd grid
 *       UTM as hash instead of function?
 *       More tolerant of extended zones in UPS zones?
 *       Return box instead of point?
 *       Return list of coordinates w/distances for truncated search as well as best.
 *       Internalize UPS projection (remove proj4js dependency).
 *
 */
import { Functions } from "./usng3";

window.USNG2 = function () {
  let grid_x;
  let grid_y;
  let Proj4js;

  // Note: grid locations are the SW corner of the grid square (because easting and northing are always positive)
  //                   0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19   x 100,000m northing
  var NSLetters135 = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
  ];
  var NSLetters246 = [
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "A",
    "B",
    "C",
    "D",
    "E",
  ];

  //                  1   2   3   4   5   6   7   8   x 100,000m easting
  var EWLetters14 = ["A", "B", "C", "D", "E", "F", "G", "H"];
  var EWLetters25 = ["J", "K", "L", "M", "N", "P", "Q", "R"];
  var EWLetters36 = ["S", "T", "U", "V", "W", "X", "Y", "Z"];

  //                  -80  -72  -64  -56  -48  -40  -32  -24  -16  -8    0    8   16   24   32   40   48   56   64   72   (*Latitude)
  //                                                                                                 Handle oddball zone 80-84
  var GridZones = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "X",
  ];
  var GridZonesDeg = [
    -80,
    -72,
    -64,
    -56,
    -48,
    -40,
    -32,
    -24,
    -16,
    -8,
    0,
    8,
    16,
    24,
    32,
    40,
    48,
    58,
    64,
    72,
    80,
  ];

  // TODO: This is approximate and actually depends on longitude too.
  var GridZonesNorthing = new Array(20);
  for (var i = 0; i < 20; i++) {
    GridZonesNorthing[i] = 110946.259 * GridZonesDeg[i]; // == 2 * PI * 6356752.3 * (latitude / 360.0)
  }

  // Grid Letters for UPS
  //                 0    1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16   17
  var XLetters = [
    "A",
    "B",
    "C",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "X",
    "Y",
    "Z",
  ];
  var YNLetters = [
    "H",
    "J",
    "K",
    "L",
    "M",
    "N",
    "P",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
  ];
  var YSLetters = [
    "N",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "M",
  ];

  // http://en.wikipedia.org/wiki/Great-circle_distance
  // http://en.wikipedia.org/wiki/Vincenty%27s_formulae
  this.llDistance = function (ll_start, ll_end) {
    var lat_s = (ll_start.lat * Math.PI) / 180;
    var lat_f = (ll_end.lat * Math.PI) / 180;
    var d_lon = ((ll_end.lon - ll_start.lon) * Math.PI) / 180;
    return Math.atan2(
      Math.sqrt(
        Math.pow(Math.cos(lat_f) * Math.sin(d_lon), 2) +
          Math.pow(
            Math.cos(lat_s) * Math.sin(lat_f) -
              Math.sin(lat_s) * Math.cos(lat_f) * Math.cos(d_lon),
            2
          )
      ),
      Math.sin(lat_s) * Math.sin(lat_f) +
        Math.cos(lat_s) * Math.cos(lat_f) * Math.cos(d_lon)
    );
  };

  /* Returns a USNG String for a UTM point, and zone id's, and precision
   * utm_zone => 15 ; grid_zone => 'T' (calculated from latitude);
   * utm_easting => 491000, utm_northing => 49786000; precision => 2
   */
  this.fromUTM = function (
    utm_zone,
    grid_zone,
    utm_easting,
    utm_northing,
    precision
  ) {
    var utm_zone;
    var grid_zone;
    var grid_square;
    var grid_easting;
    var grid_northing;
    var precision;

    var grid_square_set = utm_zone % 6;

    var ew_idx = Math.floor(utm_easting / 100000) - 1; // should be [100000, 900000]
    var ns_idx = Math.floor((utm_northing % 2000000) / 100000); // should [0, 10000000) => [0, 2000000)
    if (ns_idx < 0) {
      /* handle southern hemisphere */
      ns_idx += 20;
    }
    switch (grid_square_set) {
      case 1:
        grid_square = EWLetters14[ew_idx] + NSLetters135[ns_idx];
        break;
      case 2:
        grid_square = EWLetters25[ew_idx] + NSLetters246[ns_idx];
        break;
      case 3:
        grid_square = EWLetters36[ew_idx] + NSLetters135[ns_idx];
        break;
      case 4:
        grid_square = EWLetters14[ew_idx] + NSLetters246[ns_idx];
        break;
      case 5:
        grid_square = EWLetters25[ew_idx] + NSLetters135[ns_idx];
        break;
      case 0: // Calculates as zero, but is technically 6 */
        grid_square = EWLetters36[ew_idx] + NSLetters246[ns_idx];
        break;
      default:
        throw "USNG: can't get here";
    }

    // Calc Easting and Northing integer to 100,000s place
    var easting = Math.floor(utm_easting % 100000).toString();
    var northing = Math.floor(utm_northing % 100000);
    if (northing < 0) {
      // TODO: Does this switch to southing or is 1m south of the equator 99999?
      northing += 100000;
      //northing = -northing;
    }
    northing = northing.toString();

    // Pad up to meter precision (5 digits)
    while (easting.length < 5) easting = "0" + easting;
    while (northing.length < 5) northing = "0" + northing;

    if (precision > 5) {
      // Calculate the fractional meter parts
      var digits = precision - 5;
      grid_easting =
        easting + (utm_easting % 1).toFixed(digits).substr(2, digits);
      grid_northing =
        northing + (utm_northing % 1).toFixed(digits).substr(2, digits);
    } else {
      // Remove unnecessary digits
      grid_easting = easting.substr(0, precision);
      grid_northing = northing.substr(0, precision);
    }

    var usng_string =
      String(utm_zone) +
      grid_zone +
      " " +
      grid_square +
      " " +
      grid_easting +
      " " +
      grid_northing;
    return usng_string;
  };

  // Calculate UTM easting and northing from full, parsed USNG coordinate
  this.toUTMFromFullParsedUSNG = function (
    utm_zone,
    grid_zone,
    grid_square,
    grid_easting,
    grid_northing,
    precision,
    strict
  ) {
    var utm_easting = 0;
    var utm_northing = 0;

    var grid_square_set = utm_zone % 6;
    var ns_grid;
    var ew_grid;
    switch (grid_square_set) {
      case 1:
        ns_grid = NSLetters135;
        ew_grid = EWLetters14;
        break;
      case 2:
        ns_grid = NSLetters246;
        ew_grid = EWLetters25;
        break;
      case 3:
        ns_grid = NSLetters135;
        ew_grid = EWLetters36;
        break;
      case 4:
        ns_grid = NSLetters246;
        ew_grid = EWLetters14;
        break;
      case 5:
        ns_grid = NSLetters135;
        ew_grid = EWLetters25;
        break;
      case 0: // grid_square_set will == 0, but it is technically group 6
        ns_grid = NSLetters246;
        ew_grid = EWLetters36;
        break;
      default:
        throw "Can't get here";
    }
    var ew_idx = ew_grid.indexOf(grid_square[0]);
    var ns_idx = ns_grid.indexOf(grid_square[1]);

    if (ew_idx == -1 || ns_idx == -1)
      throw (
        "USNG: Invalid USNG 100km grid designator for UTM zone " +
        utm_zone +
        "."
      );
    //throw(RangeError("USNG: Invalid USNG 100km grid designator."));

    utm_easting = (ew_idx + 1) * 100000 + grid_easting; // Should be [100,000, 900,000]
    utm_northing = (ns_idx + 0) * 100000 + grid_northing; // Should be [0, 2,000,000)

    // TODO: this really depends on easting too...
    // At this point know UTM zone, Grid Zone (min latitude), and easting
    // Right now this is look up table returns a max number based on lon == utm zone center
    var min_northing = GridZonesNorthing[GridZones.indexOf(grid_zone)]; // Unwrap northing to ~ [0, 10000000]
    utm_northing +=
      2000000 * Math.ceil((min_northing - utm_northing) / 2000000);

    // Check that the coordinate is within the utm zone and grid zone specified:
    var ll = utm_proj.invProj(utm_zone, utm_easting, utm_northing);
    var ll_utm_zone = Math.floor((ll.lon - -180.0) / 6.0) + 1;
    var ll_grid_zone = GridZones[Math.floor((ll.lat - -80.0) / 8)];

    // If error from the above TODO mattered... then need to move north a grid
    if (ll_grid_zone != grid_zone) {
      utm_northing -= 2000000;
      ll = utm_proj.invProj(utm_zone, utm_easting, utm_northing);
      ll_utm_zone = Math.floor((ll.lon - -180.0) / 6.0) + 1;
      ll_grid_zone = GridZones[Math.floor((ll.lat - -80.0) / 8)];
    }

    if (strict) {
      if (ll.lat > 84.0 || ll.lat < -80.0)
        throw "USNG: Latitude " + ll.lat + " outside valid UTM range.";
      if (ll_utm_zone != utm_zone)
        throw (
          "USNG: calculated coordinate not in correct UTM zone! Supplied: " +
          utm_zone +
          grid_zone +
          " Calculated: " +
          ll_utm_zone +
          ll_grid_zone
        );
      if (ll_grid_zone != grid_zone)
        throw (
          "USNG: calculated coordinate not in correct grid zone! Supplied: " +
          utm_zone +
          grid_zone +
          " Calculated: " +
          ll_utm_zone +
          ll_grid_zone
        );
    } else {
      // Loosen requirements to allow for grid extensions that don't introduce ambiguity.

      // "The UTM grid extends to 80°30'S and 84°30'N, providing a 30-minute overlap with the UPS grid."
      // -- http://earth-info.nga.mil/GandG/publications/tm8358.1/tr83581b.html Section 2-6.3.1
      if (ll.lat > 84.5 || ll.lat < -79.5)
        throw "USNG: Latitude " + ll.lat + " outside valid UTM range.";

      // 100km grids E-W unique +/- 2 UTM zones of the correct UTM zone.
      // 100km grids unique for 800,000m in one UTM zone.
      // Thus, two limiting conditions for uniqueness:
      //		UTM zone max width = 665,667m at equator => 800,000m is 1.2 UTM 6* zones wide at 0*N. => 67000m outside zone.
      //			=> utm_easting in [100,000, 900,000] (800,000m wide centered at 500,000m (false easting)
      //		UTM zone min width = 63,801m at 84.5* N. => 12 UTM 6* zones.  => 2 UTM zones.
      if (utm_easting < 100000 || utm_easting > 900000)
        throw (
          "USNG: calculated coordinate not in correct UTM zone! Supplied: " +
          utm_zone +
          grid_zone +
          " Calculated: " +
          ll_utm_zone +
          ll_grid_zone
        );
      var utm_zone_diff = Math.abs(ll_utm_zone - utm_zone);
      if (utm_zone_diff > 2 && utm_zone_diff < 58)
        // utm_zone wraps 1..60,1
        throw (
          "USNG: calculated coordinate not in correct UTM zone! Supplied: " +
          utm_zone +
          grid_zone +
          " Calculated: " +
          ll_utm_zone +
          ll_grid_zone
        );

      // 100km grids N-S unique +/- 2,000,000 meters
      // A grid zone is roughly 887,570 meters N-S
      // => unique +/- 1 grid zone.
      var ll_idx = NSLetters135.indexOf(ll_grid_zone); // 135 or 246 doesn't matter
      var gz_idx = NSLetters135.indexOf(grid_zone); // letters in same order and circular subtraction.
      var gz_diff = Math.abs(ll_idx - gz_idx);
      if (gz_diff > 1 && gz_diff < 19)
        throw (
          "USNG: calculated coordinate not in correct grid zone! Supplied: " +
          utm_zone +
          grid_zone +
          " Calculated: " +
          ll_utm_zone +
          ll_grid_zone
        );
    }

    var usng_string =
      String(utm_zone) +
      grid_zone +
      " " +
      grid_square +
      " " +
      grid_easting +
      " " +
      grid_northing;
    return {
      zone: utm_zone,
      easting: utm_easting,
      northing: utm_northing,
      precision: precision,
      usng: usng_string,
    };
  };

  /* Method to convert a USNG coordinate string into a NAD83/WGS84 LonLat Point
   * First parameter: usng = A valid USNG coordinate string (possibly truncated)
   *	Possible cases:
   *		Full USNG: 14TPU3467
   *		Truncated:   TPU3467
   *		Truncated:    PU3467
   *		Truncated:      3467
   *		Truncated: 14TPU
   *		Truncated: 14T
   *		Truncated:    PU
   * Second parameter: a LonLat point to use to disambiguate a truncated USNG point
   * Returns: The LonLat point
   */
  let functions = new Functions(
    GridZones,
    NSLetters135,
    EWLetters14,
    NSLetters246,
    EWLetters25,
    NSLetters135,
    EWLetters36,
    YNLetters,
    YSLetters,
    XLetters,
    Proj4js,
    south_proj,
    ll_proj,
    north_proj,
    utm_proj
  );
  this.toUTM = functions.toUTM;

  this.fromUPS = functions.fromUPS;

  this.toUPSFromFullParsedUSNG = functions.toUPSFromFullParsedUSNG;
  this.fromUPS = function (grid_zone, ups_x, ups_y, precision) {
    if (
      !(
        grid_zone == "A" ||
        grid_zone == "B" ||
        grid_zone == "Y" ||
        grid_zone == "Z"
      )
    )
      throw "UPS only valid in zones A, B, Y, and Z";

    var grid_square;

    var grid_square_x_idx = Math.floor((ups_x - 2000000) / 100000);
    var grid_square_y_idx = Math.floor((ups_y - 2000000) / 100000);

    if (grid_square_x_idx < 0) grid_square_x_idx += 18;

    if (grid_zone == "A" || grid_zone == "B") {
      // south
      if (grid_square_y_idx < 0) grid_square_y_idx += 24;

      grid_square = XLetters[grid_square_x_idx] + YSLetters[grid_square_y_idx];
    } else {
      // north
      if (grid_square_y_idx < 0) grid_square_y_idx += 14;

      grid_square = XLetters[grid_square_x_idx] + YNLetters[grid_square_y_idx];
    }

    // Calc X and Y integer to 100,000s place
    var x = Math.floor(ups_x % 100000).toString();
    var y = Math.floor(ups_y % 100000).toString();

    // Pad up to meter precision (5 digits)
    while (x.length < 5) x = "0" + x;
    while (y.length < 5) y = "0" + y;

    if (precision > 5) {
      // Calculate the fractional meter parts
      var digits = precision - 5;
      grid_x = x + (ups_x % 1).toFixed(digits).substr(2, digits);
      grid_y = y + (ups_y % 1).toFixed(digits).substr(2, digits);
    } else {
      // Remove unnecessary digits
      grid_x = x.substr(0, precision);
      grid_y = y.substr(0, precision);
    }

    return grid_zone + " " + grid_square + " " + grid_x + " " + grid_y;
  };
  // Converts a lat, lon point (NAD83) into a USNG coordinate string
  // of precision where precision indicates the number of digits used
  // per coordinate (0 = 100,000m, 1 = 10km, 2 = 1km, 3 = 100m, 4 = 10m, ...)
  this.fromLonLat = functions.fromLonLat;

  this.toLonLat = functions.toLonLat;
  this.UTM = functions.UTM;
  var utm_proj = new this.UTM();

  // Use Proj4JS for Universal Polar Stereographic if available.
  var north_proj;
  var south_proj;
  var ll_proj;
  if (typeof Proj4js == "object") {
    Proj4js.defs["EPSG:32661"] =
      "+proj=stere +lat_0=90 +lat_ts=90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    Proj4js.defs["EPSG:32761"] =
      "+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=0 +k=0.994 +x_0=2000000 +y_0=2000000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    Proj4js.defs["EPSG:4326"] =
      "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    north_proj = new Proj4js.Proj("EPSG:32661");
    south_proj = new Proj4js.Proj("EPSG:32761");
    ll_proj = new Proj4js.Proj("EPSG:4326");
  }
};
