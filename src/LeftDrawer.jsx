import React, { Component } from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import axios from "axios";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import LayersTreeViewWithData from "./LayersTreeViewWithData";
import _ from "lodash";
import "./LeftDrawer.css";

import { mvic_base_url } from "./util";

const tabNames = ["layers", "pdfs"];

export default class LeftDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = { clicked: 0 };
    this.TabPanel = this.TabPanel.bind(this);
    this.PDFList = null;
    this.classes = ["drawer-container"];
  }

  componentDidUpdate() {
    // let layersString = this.props.layers[0].all_layer_keys.join(",");
    // layersString = encodeURIComponent(layersString);
    // layersString = layersString.replace(/%2C/g, ",");

    let intViewportWidth = window.olMap.getSize()[0];
    let intViewportHeight = window.olMap.getSize()[1];
    let bbox = window.olMap.getView().calculateExtent();

    bbox = bbox.join(",");
    // axios
    //   .get(
    //     `http://localhost:6003/memento/publisher/source/viewport?SRS=EPSG:3857&WIDTH=${intViewportWidth}&HEIGHT=${intViewportHeight}&BBOX=${bbox}&LAYERS=${layersString}`
    //   )
    //   .then((res) => {
    //     this.PDFList = res.data.maps.map((map) => {
          return (
            <>
              <Typography style={{ padding: "10px" }}>
                <Link
                  // href={`http://localhost:6003/memento/publisher/pdf/file/${map.layer}/${map.filename}`}
                  // target="_blank"
                >
                  {/* {map.filename} */}
                </Link>
              </Typography>
              <br />
            </>
          );
        // });
      // });
  }

  TabPanel(tabProps) {
    const { currentTab } = this.props;
    const { children, tabName } = tabProps;
    if (this.isLoading) {
      return (
        <div
          className="tab-panel"
          style={{
            visibility: currentTab === tabName ? null : "hidden",
          }}
        >
          <CircularProgress />
        </div>
      );
    } else {
      return (
        <div
          className="tab-panel"
          style={{
            visibility: currentTab === tabName ? null : "hidden",
          }}
        >
          {children}
        </div>
      );
    }
  }

  render() {
    if (this.props.drawerIsOpen) {
      this.classes = ["drawer-container", "open"];
    } else {
      this.classes = ["drawer-container"];
    }

    return (
      <div
        className={this.classes.join(" ")}
        // style={{
        //   transition:
        //     (props.drawerIsTransitioning && `${props.transitionTime}ms`) || null,
        // }}
      >
        <div className="tabs">
          <Tabs
            value={_.indexOf(tabNames, this.props.currentTab)}
            onChange={(e, index) => this.props.setCurrentTab(tabNames[index])}
          >
            <Tab label="Layers" />
            <Tab label="PDFs" />
          </Tabs>
        </div>
        <this.TabPanel tabName={"layers"}>
          <LayersTreeViewWithData baseUrl={mvic_base_url()} />
        </this.TabPanel>
        <this.TabPanel tabName={"pdfs"}>
          <Button
            style={{ float: "right", margin: "10px" }}
            onClick={() => {
              this.isLoading = true;
              this.forceUpdate();
              setTimeout(() => {
                this.isLoading = false;
                this.forceUpdate();
              }, 500);
            }}
          >
            REFRESH
          </Button>
          {this.PDFList}
        </this.TabPanel>
      </div>
    );
  }
}
