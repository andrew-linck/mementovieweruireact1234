import React from "react";
import { connect } from "react-redux";
import MapCatalog from "./MapCatalog";
import {
  map_catalog_remove_item,
  map_catalog_open,
  map_catalog_close,
  insert_item,
  add_folder,
  add_pdf,
  refresh_layers_for_pdfs,
  select_pdf,
  remove_pdf,
} from "../actions";

function mapStateToProps(state) {
  return {
    servers: state.servers,
    isOpen: state.map_catalog.is_open,
    selectedLayer: state.map_catalog.selected_item,
    pdfs: state.map_catalog.pdfs,
    selectedPdf: state.map_catalog.selected_pdf,
  };
}

const mapDispatchToProps = {
  removeItem: map_catalog_remove_item,
  addFolder: add_folder,
  insertItem: insert_item,
  openCatalog: map_catalog_open,
  closeCatalog: map_catalog_close,
  refreshPdfs: refresh_layers_for_pdfs,
  addPdf: add_pdf,
  selectPdf: select_pdf,
  removePdf: remove_pdf,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapCatalog);
