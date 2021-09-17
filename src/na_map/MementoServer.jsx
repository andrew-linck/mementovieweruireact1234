import React, { Component } from "react";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { MapContext } from "./Map";
import TileDebug from "ol/source/TileDebug";
import OSM from "ol/source/OSM";

export const MementoServerContext = React.createContext();

export class MementoServer extends Component {
  static contextType = MapContext;

  constructor(props) {
    super(props);
    this.addMementoServerLayer = this.addMementoServerLayer.bind(this);
    this.removeMementoServerLayer = this.removeMementoServerLayer.bind(this);
    this.olSource = null;
    this.olLayer = null;
    this._layer_set = new Set();
  }

  addMementoServerLayer(name) {
    //console.log(`Memento Server Layer add: ${name}`);
    this._layer_set.add(name);
    this.forceUpdate();
  }

  removeMementoServerLayer(name) {
    //console.log(`Memento Server Layer remove: ${name}`);
    this._layer_set.delete(name);
    this.forceUpdate();
  }

  buildUrl() {
    const base_url = this.props.base_url;
    const nl = !!this.props.neatline;
    const nlc = Number(this.props.neatline_color).toString(16);
    const layers = Array.from(this._layer_set)
      .map(encodeURIComponent)
      .join(",");
    const url = `${base_url}memento/xyz/image/{z}/{x}/{y}.webp?neatline=${nl}&neatline_color=0x${nlc}&layers=${layers}`;
    return url;
  }

  componentDidMount() {
    const url = this.buildUrl();
    this.olSource = new XYZ({ url });
    this.osmSource = new OSM();
    window.olSource = this.olSource;
    window.osmSource = this.osmSource;
    this.olLayer = new TileLayer({ source: this.olSource });
    // window.olMap.addLayer(
    //   new TileLayer({
    //     source: new TileDebug({
    //       projection: "EPSG:3857",
    //       tileGrid: this.olSource.getTileGrid(),
    //     }),
    //   })
    // );
    this.context.addOlLayer(this.props.base_url, this.olLayer);
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.context.removeOlLayer(this.props.base_url);
  }

  componentDidUpdate() {
    try {
      const old_url = this.olSource.getUrls()[0];
      const new_url = this.buildUrl();
      //console.log({old_url, new_url});
      if (old_url !== new_url) {
        //console.log(`Updating OL Source URL to ${new_url}`);
        this.olSource.setUrl(new_url);
      }
    } catch (e) {
      console.error("Error during update: ", e);
    }
  }

  render() {
    const value = {
      addMementoServerLayer: this.addMementoServerLayer,
      removeMementoServerLayer: this.removeMementoServerLayer,
    };
    return (
      <MementoServerContext.Provider value={value}>
        {this.props.children}
      </MementoServerContext.Provider>
    );
  }
}
