import React from "react";
import Footer from "./Footer";
import { connect } from "react-redux";
import { left_drawer_open, left_drawer_close, error_message } from "./actions";

function mapStateToProps(state) {
  return {
    drawerIsOpen: state.left_drawer.is_open,
  };
}

const mapDispatchToProps = {
  left_drawer_open,
  left_drawer_close,
  error_message,
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
