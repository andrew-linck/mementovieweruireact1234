import React, { Component } from "react";
import { Map, MementoServer, MementoLayer } from "./na_map";
import MapWithData from "./na_map/MapWithData";
import { active_layers } from "./util.js";
import "./MainContent.css";

// Components
import TopBarWithData from "./TopBarWithData";
import FooterWithData from "./FooterWithData";
import ClickedPoint from "./ClickedPoint";

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.classes = ["main-container"];
    // this.transitionTime = this.transitionTime.bind(this);
  }

  componentDidMount() {
    function testing() {
      setTimeout(() => {
        document.getElementById("unit_switch").click();
        document.getElementById("unit_switch").click();
        document.getElementById("unit_switch").click();
        document.getElementById("unit_switch").click();
        document.getElementById("unit_switch").click();
      }, 2000);
    }
    testing();
  }

  render() {
    const classes = [...this.classes];

    if (this.props.drawerIsOpen) {
      classes.push("open");
    }

    // if (this.props.drawerIsTransitioning) {
    //   classes.push("transitioning");
    // }

    return (
      <main
        className={classes.join(" ")}
        // style={{
        //   transition:
        //     (this.props.drawerIsTransitioning &&
        //       `${this.props.transitionTime}ms`) ||
        //     null,
        // }}
      >
        <ClickedPoint />
        <MapWithData>
          <TopBarWithData />
          <FooterWithData />

          {this.props.servers.map((server) => (
            <MementoServer
              key={server.base_url}
              base_url={server.base_url}
              neatline={this.props.neatline}
              neatline_color={this.props.neatline_color}
            >
              {active_layers(server).map((name) => (
                <MementoLayer key={name} name={name} />
              ))}
            </MementoServer>
          ))}
        </MapWithData>
      </main>
    );
  }
}

export default MainContent;
