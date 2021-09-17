import React from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import "./Footer.css";

export default function Footer(props) {
  return (
    <div className="footer-container">
      <Container>
        <Typography id="measureNumber"></Typography>
        <Typography id="positionUnit"></Typography>
        <Typography id="mousePosition"></Typography>
      </Container>
    </div>
  );
}

Footer.propTypes = {
  drawerIsOpen: PropTypes.bool.isRequired,
};
