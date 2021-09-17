import React from "react";
import PropTypes from "prop-types";
import ToggleCatalog from "./ToggleCatalog";
import "./MapCatalog.css";

import LayersTreeViewWithData from "../LayersTreeViewWithData";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";

import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import { mvic_base_url } from "../util";

class MapCatalog extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.refreshPdfs();
  }

  openCatalog() {
    this.props.openCatalog();
  }

  closeCatalog() {
    this.props.closeCatalog();
  }

  render() {
    return (
      <>
        <Button variant="contained" onClick={() => this.openCatalog()}>
          Open Catalog
        </Button>
        <ToggleCatalog isOpen={this.props.isOpen}>
          <div>
            <Button
              variant="contained"
              onClick={() => {
                this.props.removeItem(this.props.selectedLayer);
              }}
            >
              Remove Item
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                this.props.insertItem(this.props.selectedLayer, {
                  full_name: "Layer2",
                  item_name: "Layer2",
                  rank: 0,
                });
              }}
            >
              Insert Item
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                this.props.addFolder(this.props.selectedLayer, {
                  full_name: "New",
                  item_name: "New",
                  items: [],
                });
              }}
            >
              Add Folder
            </Button>
            <input
              type="file"
              id="pickedFile"
              variant="contained"
              onChange={(e) => {
                var fileList = document.getElementById("pickedFile").files;
                this.props.addPdf(this.props.selectedLayer, fileList[0].name);
              }}
            />
            <label htmlFor="pickedFile">ADD PDF</label>
            <Box className="catalog-inner-container">
              <Box id="tree-container">
                <LayersTreeViewWithData
                  baseUrl={mvic_base_url()}
                  id="layerstree"
                />
              </Box>
              <Button
                variant="contained"
                onClick={() => {
                  this.props.removePdf(
                    this.props.selectedLayer,
                    this.props.selectedPdf
                  );
                }}
              >
                Remove Pdf
              </Button>
              <Box id="mapsets">
                <List>
                  {this.props.pdfs.map((element) => {
                    if (element.active == true) {
                      return element.pdfs.map((pdf) => {
                        return (
                          <ListItem
                            button
                            onClick={() => {
                              this.props.selectPdf(pdf);
                            }}
                            selected={this.props.selectedPdf === pdf}
                          >
                            <ListItemText primary={pdf}></ListItemText>
                          </ListItem>
                        );
                      });
                    }
                  })}
                </List>
              </Box>
            </Box>
            <Button variant="contained" onClick={() => this.closeCatalog()}>
              Close Catalog
            </Button>
          </div>
        </ToggleCatalog>
      </>
    );
  }
}

export default MapCatalog;
