import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TreeItem from "@material-ui/lab/TreeItem";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ServerImage from "./images/server.svg";
import FolderImage from "./images/folder.svg";
import LayerImage from "./images/layer.svg";
import { select_tree_item, refresh_layers_for_pdfs } from "./actions";

function LayersTreeItem({
  nodeId,
  type,
  label,
  checked,
  onChecked,
  onExpanded,
  onContextMenuRequested,
  children,
  selectItem,
  refreshPdfs,
}) {
  const icon =
    type === "server"
      ? ServerImage
      : type === "folder"
      ? FolderImage
      : type === "layer"
      ? LayerImage
      : "";

  const treeItemRef = React.useRef();

  return (
    <TreeItem
      onClick={() => {
        selectItem(nodeId);
        refreshPdfs();
      }}
      ref={treeItemRef}
      nodeId={nodeId}
      collapseIcon={
        <div onClick={() => onExpanded(nodeId, false)}>
          <ArrowDropDownIcon />
        </div>
      }
      expandIcon={
        <div onClick={() => onExpanded(nodeId, true)}>
          <ArrowRightIcon />
        </div>
      }
      label={
        <div
          className="layers_tree_item"
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Checkbox
            checked={checked}
            onChange={(e) => onChecked(nodeId, e.target.checked)}
            color="default"
          />
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundImage: `url(${icon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "24px 24px",
            }}
          />
          &nbsp;
          {label}
        </div>
      }
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenuRequested(nodeId, {
          anchor_el: treeItemRef.current,
          type,
          label,
          checked,
        });
      }}
    >
      {children}
    </TreeItem>
  );
}

LayersTreeItem.propTypes = {
  nodeId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool.isRequired,
  onChecked: PropTypes.func.isRequired,
  onExpanded: PropTypes.func.isRequired,
  onContextMenuRequested: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
};

const mapDispatchToProps = {
  selectItem: select_tree_item,
  refreshPdfs: refresh_layers_for_pdfs,
};

export default connect(null, mapDispatchToProps)(LayersTreeItem);
