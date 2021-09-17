import React from "react";
import PropTypes from "prop-types";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function ContextMenu({
  anchorEl,
  items,
  onClick,
  onClose,
  closeAfterClick,
  positionX,
  positionY,
}) {
  const closeAfterClick_ =
    closeAfterClick === undefined ? true : closeAfterClick;
  let position = { left: positionX, top: positionY };
  if (!positionX || !positionY) {
    position = { left: 10, top: 10 };
  }
  return (
    <Menu
      anchorPosition={position}
      anchorReference={"anchorPosition"}
      anchorEl={anchorEl}
      open={!!anchorEl}
      keepMounted
      onClose={onClose}
    >
      {items &&
        items.map((item, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              try {
                onClick(item);
              } catch (e) {
                console.error(e);
              }
              if (closeAfterClick_) {
                try {
                  onClose();
                } catch (e) {
                  console.error(e);
                }
              }
            }}
          >
            {item.label}
          </MenuItem>
        ))}
    </Menu>
  );
}
ContextMenu.propTypes = {
  items: PropTypes.array,
  positionX: PropTypes.any,
  positionY: PropTypes.any,
  onClick: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  closeAfterClick: PropTypes.bool,
};
