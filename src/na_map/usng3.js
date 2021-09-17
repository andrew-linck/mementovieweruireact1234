export class Functions {
  constructor(
    GridZones,
    NSLetters135,
    EWLetters14,
    NSLetters246,
    EWLetters25,
    EWLetters36,
    YNLetters,
    YSLetters,
    XLetters,
    Proj4js,
    south_proj,
    ll_proj,
    north_proj,
    utm_proj
  ) {
    this.toUTM = function (usng, initial_lonlat, strict) {
      // Parse USNG into component parts
      var easting = 0;
      var northing = 0;
      var precision = 0;

      var digits = ""; /* don't really need this if using call to parsed... */
      var grid_square = null;
      var grid_zone = null;
      var utm_zone = null;

      // Remove Whitespace (shouldn't be any)
      usng = usng.replace(/ /g, "");

      // Strip Coordinate values off of end, if any
      // This will be any trailing digits.
      re = new RegExp("([0-9]+)$");
      fields = re.exec(usng);
      if (fields) {
        digits = fields[0];
        precision = digits.length / 2; // TODO: throw an error if #digits is odd.
        var scale_factor = Math.pow(10, 5 - precision); // 1 digit => 10k place, 2 digits => 1k ...
        easting = Number(digits.substr(0, precision)) * scale_factor;
        northing = Number(digits.substr(precision, precision)) * scale_factor;
      }
      usng = usng.substr(0, usng.length - precision * 2);

      // Get 100km Grid Designator, if any
      var re = new RegExp("([A-Z][A-Z]$)");
      var fields = re.exec(usng);
      if (fields) {
        grid_square = fields[0];
      }
      usng = usng.substr(0, usng.length - 2);

      // Get UTM and Grid Zone
      re = new RegExp("([0-9]+)([A-Z])");
      fields = re.exec(usng);
      if (fields) {
        utm_zone = fields[1];
        grid_zone = fields[2];
      }
      // Allow the number-less A,B,Y,Z UPS grid zones
      if (!utm_zone) {
        re = new RegExp("([A-Z])");
        fields = re.exec(usng);
        if (fields) grid_zone = fields[1];
      }

      // Use lonlat Point as approx Location to fill in missing prefix info
      // Note: actual prefix need not be the same as that of the llPoint (we could cross 100km grid squares, utm zones, etc.)
      // Our job is to find the closest point to the llPoint given what we know about the USNG point.

      // Calculate the UTM zone, easting and northing from what we know

      /* Method: we can only guess missing prefix information so our cases are:
       * We have everything (14TPU)
       * We are missing the UTM zone (PU)
       * We are missing the UTM zone and the grid designator
       * TODO: Need to throw an exception if utm_zone and no grid_zone as invalid
       * TODO: Also need to throw an exception if don't have at least one of grid_zone and coordinate...maybe
       * TODO: Error if grid_zone is not in GridZones
       */

      if (utm_zone && grid_zone && grid_square) {
        // We have everything so there is nothing more to do, UTM.
      } else if (
        (grid_zone == "A" ||
          grid_zone == "B" ||
          grid_zone == "Y" ||
          grid_zone == "Z") &&
        grid_square
      ) {
        // We have everything so there is nothing more to do, UPS.
      } else if (grid_square && initial_lonlat) {
        // We need to find the utm_zone and grid_zone
        // We know the grid zone so first we need to find the closest matching grid zone
        // to the initial point. Then add in the easting and northing (if any).
        //throw("USNG: Truncated coordinate support not implemented");

        // Linear search all possible points (TODO: try to put likely guesses near top of list)
        var min_arc_distance = 1000;
        var min_utm_zone = null;
        var min_grid_zone = null;

        var ll_utm_zone = Math.floor((initial_lonlat.lon - -180.0) / 6.0) + 1;
        var ll_grid_zone_idx = Math.floor((initial_lonlat.lat - -80.0) / 8);

        // Check the min ranges that need to be searched based on the spec.
        // Need to wrap UTM zones mod 60
        for (
          utm_zone = ll_utm_zone - 1;
          utm_zone <= ll_utm_zone + 1;
          utm_zone++
        ) {
          // still true at 80*?
          for (var grid_zone_idx = 0; grid_zone_idx < 20; grid_zone_idx++) {
            grid_zone = GridZones[grid_zone_idx];
            try {
              var result = this.toLonLat(
                (utm_zone % 60) + grid_zone + grid_square + digits,
                null,
                true
              ); // usng should be [A-Z][A-Z][0-9]+

              var arc_distance = this.llDistance(initial_lonlat, result);
              //console.log(utm_zone + grid_zone + grid_square + digits + " " + arc_distance);
              if (arc_distance < min_arc_distance) {
                min_arc_distance = arc_distance;
                min_utm_zone = utm_zone % 60;
                min_grid_zone = grid_zone;
              }
            } catch (e) {
              //console.log("USNG: upstream: "+e); // catch range errors and ignore
            }
          }
        }
        // Search UPS zones
        var ups_zones;
        if (initial_lonlat.lat > 0) ups_zones = ["Y", "Z"];
        else ups_zones = ["A", "B"];
        for (var grid_zone_idx in ups_zones) {
          grid_zone = ups_zones[grid_zone_idx];
          try {
            var result = this.toLonLat(
              grid_zone + grid_square + digits,
              null,
              true
            ); // usng should be [A-Z][A-Z][0-9]+

            var arc_distance = this.llDistance(initial_lonlat, result);
            //console.log(grid_zone + grid_square + digits + " " + arc_distance);
            if (arc_distance < min_arc_distance) {
              min_arc_distance = arc_distance;
              min_utm_zone = null;
              min_grid_zone = grid_zone;
            }
          } catch (e) {
            //console.log("USNG: upstream: "+e); // catch range errors and ignore
          }
        }

        if (min_grid_zone) {
          utm_zone = min_utm_zone;
          grid_zone = min_grid_zone;
        } else {
          throw "USNG: Couldn't find a match";
        }
      } else if (initial_lonlat) {
        // We need to find the utm_zone, grid_zone and 100km grid designator
        // Find the closest grid zone within the specified easting and northing
        // Note: may cross UTM zone boundaries!
        // Linear search all possible points (TODO: try to put likely guesses near top of list)
        var min_arc_distance = 1000;
        var min_utm_zone = null;
        var min_grid_zone = null;
        var min_grid_square = null;

        var ll_utm_zone = Math.floor((initial_lonlat.lon - -180.0) / 6.0) + 1;
        var ll_grid_zone_idx = Math.floor((initial_lonlat.lat - -80.0) / 8);

        // Check the min ranges that need to be searched based on the spec.
        for (
          utm_zone = ll_utm_zone - 1;
          utm_zone <= ll_utm_zone + 1;
          utm_zone++
        ) {
          // still true at 80*?
          for (
            var grid_zone_idx = ll_grid_zone_idx - 1;
            grid_zone_idx <= ll_grid_zone_idx + 1;
            grid_zone_idx++
          ) {
            grid_zone = GridZones[grid_zone_idx];
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
            //console.log(utm_zone + grid_zone);
            for (var ns_idx = 0; ns_idx < 20; ns_idx++) {
              for (var ew_idx = 0; ew_idx < 8; ew_idx++) {
                try {
                  grid_square = ew_grid[ew_idx] + ns_grid[ns_idx];
                  var result = this.toLonLat(
                    (utm_zone % 60) + grid_zone + grid_square + digits,
                    null,
                    true
                  ); // usng should be [A-Z][A-Z][0-9]+

                  var arc_distance = this.llDistance(initial_lonlat, result);
                  //console.log(utm_zone + grid_zone + grid_square + digits + " " + arc_distance);
                  if (arc_distance < min_arc_distance) {
                    min_arc_distance = arc_distance;
                    min_utm_zone = utm_zone % 60;
                    min_grid_zone = grid_zone;
                    min_grid_square = grid_square;
                  }
                } catch (e) {
                  //console.log("USNG: upstream: "+e); // catch range errors and ignore
                }
              }
            }
          }
        }
        // Search UPS zones
        var ups_zones;
        var y_zones;
        var y_max;
        if (initial_lonlat.lat > 0) {
          ups_zones = ["Y", "Z"];
          y_zones = YNLetters;
          y_max = 14;
        } else {
          ups_zones = ["A", "B"];
          y_zones = YSLetters;
          y_max = 24;
        }
        for (var grid_zone_idx in ups_zones) {
          grid_zone = ups_zones[grid_zone_idx];

          for (var y_idx = 0; y_idx < y_max; y_idx++) {
            for (var x_idx = 0; x_idx < 18; x_idx++) {
              try {
                grid_square = XLetters[x_idx] + y_zones[y_idx];
                var result = this.toLonLat(
                  grid_zone + grid_square + digits,
                  null,
                  true
                ); // usng should be [A-Z][A-Z][0-9]+

                var arc_distance = this.llDistance(initial_lonlat, result);
                //console.log(grid_zone + grid_square + digits + " " + arc_distance);
                if (arc_distance < min_arc_distance) {
                  min_arc_distance = arc_distance;
                  min_utm_zone = null;
                  min_grid_zone = grid_zone;
                  min_grid_square = grid_square;
                }
              } catch (e) {
                //console.log("USNG: upstream: "+e); // catch range errors and ignore
              }
            }
          }
        }

        if (min_grid_zone) {
          utm_zone = min_utm_zone;
          grid_zone = min_grid_zone;
          grid_square = min_grid_square;
        } else {
          throw "USNG: Couldn't find a match";
        }
      } else {
        throw "USNG: Not enough information to locate point.";
      }

      if (
        grid_zone == "A" ||
        grid_zone == "B" ||
        grid_zone == "Y" ||
        grid_zone == "Z"
      )
        return this.toUPSFromFullParsedUSNG(
          grid_zone,
          grid_square,
          easting,
          northing,
          precision
        );
      else
        return this.toUTMFromFullParsedUSNG(
          utm_zone,
          grid_zone,
          grid_square,
          easting,
          northing,
          precision,
          strict
        );
    };
    this.toUPSFromFullParsedUSNG = function (
      grid_zone,
      grid_square,
      grid_x,
      grid_y,
      precision
    ) {
      if (!Proj4js) throw "USNG: Zones A,B,Y, and Z require Proj4js.";

      /* Start at the pole */
      var ups_x = 2000000;
      var ups_y = 2000000;

      /* Offset based on 100km grid square */
      var x_idx = XLetters.indexOf(grid_square[0]);
      if (x_idx < 0) throw "USNG: Invalid grid square.";
      var y_idx;
      switch (grid_zone) {
        case "A": // South West half-hemisphere
          x_idx = x_idx - 18;
        case "B": // South East half-hemisphere
          y_idx = YSLetters.indexOf(grid_square[1]);
          if (x_idx < -12 || x_idx > 11 || y_idx < 0)
            throw "USNG: Invalid grid square.";

          if (y_idx > 11) y_idx = y_idx - 24;
          break;

        case "Y": // North West half-hemisphere
          x_idx = x_idx - 18;
        case "Z": // North East half-hemisphere
          y_idx = YNLetters.indexOf(grid_square[1]);
          if (x_idx < -7 || x_idx > 6 || y_idx < 0)
            throw "USNG: Invalid grid square.";

          if (y_idx > 6) y_idx = y_idx - 14;
          break;

        default:
          throw "UPS only valid in zones A, B, Y, and Z";
      }
      //console.log(x_idx, y_idx);
      ups_x += x_idx * 100000;
      ups_y += y_idx * 100000;

      /* Offset based on grid_x,y */
      ups_x += grid_x;
      ups_y += grid_y;

      // Check that the coordinate is within the ups zone and grid zone specified:
      var ll = { x: ups_x, y: ups_y };
      if (grid_zone == "A" || grid_zone == "B") {
        Proj4js.transform(south_proj, ll_proj, ll);
        if (ll.y > -80.0) throw "USNG: Grid Zone A or B but Latitude > -80.";
      } else {
        Proj4js.transform(north_proj, ll_proj, ll);
        if (ll.y < 84.0) throw "USNG: Grid Zone Y or Z but Latitude < 84.";
      }

      var usng_string =
        grid_zone + " " + grid_square + " " + grid_x + " " + grid_y;
      return {
        grid_zone: grid_zone,
        x: ups_x,
        y: ups_y,
        precision: precision,
        usng: usng_string,
      };
    };
    this.UTM = function () {
      // Functions to convert between lat,lon and utm. Derived from visual basic
      // routines from Craig Perault. This assumes a NAD83 datum.

      // constants
      var MajorAxis = 6378137.0;
      var MinorAxis = 6356752.3;
      var Ecc =
        (MajorAxis * MajorAxis - MinorAxis * MinorAxis) /
        (MajorAxis * MajorAxis);
      var Ecc2 = Ecc / (1.0 - Ecc);
      var K0 = 0.9996;
      var E4 = Ecc * Ecc;
      var E6 = Ecc * E4;
      var degrees2radians = Math.PI / 180.0;

      // Computes the meridian distance for the GRS-80 Spheroid.
      // See equation 3-22, USGS Professional Paper 1395.
      function meridianDist(lat) {
        var c1 = MajorAxis * (1 - Ecc / 4 - (3 * E4) / 64 - (5 * E6) / 256);
        var c2 =
          -MajorAxis * ((3 * Ecc) / 8 + (3 * E4) / 32 + (45 * E6) / 1024);
        var c3 = MajorAxis * ((15 * E4) / 256 + (45 * E6) / 1024);
        var c4 = (-MajorAxis * 35 * E6) / 3072;

        return (
          c1 * lat +
          c2 * Math.sin(lat * 2) +
          c3 * Math.sin(lat * 4) +
          c4 * Math.sin(lat * 6)
        );
      }

      // Convert lat/lon (given in decimal degrees) to UTM, given a particular UTM zone.
      this.proj = function (zone, in_lon, in_lat) {
        var centeralMeridian = -((30 - zone) * 6 + 3) * degrees2radians;

        var lat = in_lat * degrees2radians;
        var lon = in_lon * degrees2radians;

        var latSin = Math.sin(lat);
        var latCos = Math.cos(lat);
        var latTan = latSin / latCos;
        var latTan2 = latTan * latTan;
        var latTan4 = latTan2 * latTan2;

        var N = MajorAxis / Math.sqrt(1 - Ecc * (latSin * latSin));
        var c = Ecc2 * latCos * latCos;
        var a = latCos * (lon - centeralMeridian);
        var m = meridianDist(lat);

        var temp5 = 1.0 - latTan2 + c;
        var temp6 = 5.0 - 18.0 * latTan2 + latTan4 + 72.0 * c - 58.0 * Ecc2;
        var temp11 = Math.pow(a, 5);

        var x =
          K0 *
            N *
            (a + (temp5 * Math.pow(a, 3)) / 6.0 + (temp6 * temp11) / 120.0) +
          500000;

        var temp7 =
          ((5.0 - latTan2 + 9.0 * c + 4.0 * (c * c)) * Math.pow(a, 4)) / 24.0;
        var temp8 = 61.0 - 58.0 * latTan2 + latTan4 + 600.0 * c - 330.0 * Ecc2;
        var temp9 = (temp11 * a) / 720.0;

        var y = K0 * (m + N * latTan * ((a * a) / 2.0 + temp7 + temp8 * temp9));

        return { utm_zone: zone, utm_easting: x, utm_northing: y };
      };

      // Convert UTM coordinates (given in meters) to Lat/Lon (in decimal degrees), given a particular UTM zone.
      this.invProj = function (zone, easting, northing) {
        var centeralMeridian = -((30 - zone) * 6 + 3) * degrees2radians;

        var temp = Math.sqrt(1.0 - Ecc);
        var ecc1 = (1.0 - temp) / (1.0 + temp);
        var ecc12 = ecc1 * ecc1;
        var ecc13 = ecc1 * ecc12;
        var ecc14 = ecc12 * ecc12;

        easting = easting - 500000.0;

        var m = northing / K0;
        var um =
          m /
          (MajorAxis *
            (1.0 - Ecc / 4.0 - 3.0 * (E4 / 64.0) - 5.0 * (E6 / 256.0)));

        var temp8 = 1.5 * ecc1 - (27.0 / 32.0) * ecc13;
        var temp9 = (21.0 / 16.0) * ecc12 - (55.0 / 32.0) * ecc14;

        var latrad1 =
          um +
          temp8 * Math.sin(2 * um) +
          temp9 * Math.sin(4 * um) +
          ((151.0 * ecc13) / 96.0) * Math.sin(6.0 * um);

        var latsin1 = Math.sin(latrad1);
        var latcos1 = Math.cos(latrad1);
        var lattan1 = latsin1 / latcos1;
        var n1 = MajorAxis / Math.sqrt(1.0 - Ecc * latsin1 * latsin1);
        var t2 = lattan1 * lattan1;
        var c1 = Ecc2 * latcos1 * latcos1;

        var temp20 = 1.0 - Ecc * latsin1 * latsin1;
        var r1 =
          (MajorAxis * (1.0 - Ecc)) / Math.sqrt(temp20 * temp20 * temp20);

        var d1 = easting / (n1 * K0);
        var d2 = d1 * d1;
        var d3 = d1 * d2;
        var d4 = d2 * d2;
        var d5 = d1 * d4;
        var d6 = d3 * d3;

        var t12 = t2 * t2;
        var c12 = c1 * c1;

        var temp1 = (n1 * lattan1) / r1;
        var temp2 = 5.0 + 3.0 * t2 + 10.0 * c1 - 4.0 * c12 - 9.0 * Ecc2;
        var temp4 =
          61.0 + 90.0 * t2 + 298.0 * c1 + 45.0 * t12 - 252.0 * Ecc2 - 3.0 * c12;
        var temp5 = ((1.0 + 2.0 * t2 + c1) * d3) / 6.0;
        var temp6 =
          5.0 - 2.0 * c1 + 28.0 * t2 - 3.0 * c12 + 8.0 * Ecc2 + 24.0 * t12;

        var lat =
          ((latrad1 -
            temp1 * (d2 / 2.0 - temp2 * (d4 / 24.0) + (temp4 * d6) / 720.0)) *
            180) /
          Math.PI;
        var lon =
          ((centeralMeridian + (d1 - temp5 + (temp6 * d5) / 120.0) / latcos1) *
            180) /
          Math.PI;
        //easting = easting + 500000.0;

        return { lon: lon, lat: lat };
      };
    };
    var utm_proj = new this.UTM();
    this.fromLonLat = function (lonlat, precision) {
      var lon = lonlat.lon;
      var lat = lonlat.lat;

      // Normalize Latitude and Longitude
      while (lon < -180) {
        lon += 180;
      }
      while (lon > 180) {
        lon -= 180;
      }

      // Calculate UTM Zone number from Longitude
      // -180 = 180W is grid 1... increment every 6 degrees going east
      // Note [-180, -174) is in grid 1, [-174,-168) is 2, [174, 180) is 60
      var utm_zone = Math.floor((lon - -180.0) / 6.0) + 1;

      // Calculate USNG Grid Zone Designation from Latitude
      // Starts at -80 degrees and is in 8 degree increments
      if (!(lat > -80 && lat < 84)) {
        if (!north_proj)
          throw "USNG: Latitude must be between -80 and 84. (Zones A,B,Y, and Z require Proj4js.)";

        var grid_zone;
        var ups_pt = new Proj4js.Point(lon, lat);

        if (lat > 0) {
          Proj4js.transform(ll_proj, north_proj, ups_pt);
          grid_zone = lon < 0 ? "Y" : "Z";
        } else {
          Proj4js.transform(ll_proj, south_proj, ups_pt);
          grid_zone = lon < 0 ? "A" : "B";
        }
        return this.fromUPS(grid_zone, ups_pt.x, ups_pt.y, precision);
      }

      var grid_zone = GridZones[Math.floor((lat - -80.0) / 8)];
      var utm_pt = utm_proj.proj(utm_zone, lon, lat);

      return this.fromUTM(
        utm_zone,
        grid_zone,
        utm_pt.utm_easting,
        utm_pt.utm_northing,
        precision
      );
    };
    this.toLonLat = function (usng, initial_lonlat, strict) {
      var result = this.toUTM(usng, initial_lonlat, strict);
      var grid_zone = result.grid_zone;
      var ll;

      //console.log(result);
      if (south_proj && (grid_zone == "A" || grid_zone == "B")) {
        var pt = { x: result.x, y: result.y };
        Proj4js.transform(south_proj, ll_proj, pt);
        ll = {
          lon: pt.x,
          lat: pt.y,
          precision: result.precision,
          usng: result.usng,
        };
      } else if (north_proj && (grid_zone == "Y" || grid_zone == "Z")) {
        var pt = { x: result.x, y: result.y };
        Proj4js.transform(north_proj, ll_proj, pt);
        ll = {
          lon: pt.x,
          lat: pt.y,
          precision: result.precision,
          usng: result.usng,
        };
      } else {
        ll = utm_proj.invProj(result.zone, result.easting, result.northing);
        ll.precision = result.precision;
        ll.usng = result.usng;
      }
      return ll;
    };
  }
}
