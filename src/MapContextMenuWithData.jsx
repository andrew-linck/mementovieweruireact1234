import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ContextMenu from "./ContextMenu";
import { context_menu_close, context_menu_click } from "./actions";

const MapContextMenuWithLogic = ({
  anchorEl,
  items,
  closeAfterClick,
  context_menu_close,
  context_menu_click,
  positionX,
  positionY,
}) => {
  return (
    <ContextMenu
      positionX={positionX}
      positionY={positionY}
      anchorEl={anchorEl}
      items={items}
      closeAfterClick={closeAfterClick}
      onClose={() => context_menu_close()}
      onClick={(item) => context_menu_click(item)}
    />
  );
};

const mapStateToProps = (state) => ({
  anchorEl: state.context_menu_lite && state.context_menu_lite.anchor_el,
  items: state.context_menu_lite && state.context_menu_lite.items,
  positionX: state.context_menu_lite && state.context_menu_lite.positionX,
  positionY: state.context_menu_lite && state.context_menu_lite.positionY,
});

const mapDispatchToProps = {
  context_menu_close,
  context_menu_click,
};

// Having `WithData` implies `WithLogic`
const MapContextMenuWithData = connect(
  mapStateToProps,
  mapDispatchToProps
)(MapContextMenuWithLogic);
MapContextMenuWithData.propTypes = {
  closeAfterClick: PropTypes.bool,
};

export default MapContextMenuWithData;
