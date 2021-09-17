import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LayersTreeView from "./LayersTreeView";
import {
  activate_folder_or_layer,
  activate_server,
  error_message,
  expand_folder,
  expand_server,
  refresh_layers_for_server,
  context_menu_open,
} from "./actions";

class LayersTreeViewWithLogic extends React.Component {
  constructor(props) {
    super(props);
    this.state = { servers: props.servers };
  }

  componentDidMount() {
    this.props.refresh_layers_for_server(this.props.baseUrl, (error) =>
      this._on_error(error)
    );
  }

  _on_error(error) {
    const error_payload = {
      error: "VIEWER NOT STARTED",
      reason:
        "Memento Viewer has not been started, and therefore no data from it can be obtained and/or shown.",
    };
    this.props.error_message(error_payload);
    if (!!this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (!this.props.servers || this.props.servers.length === 0) {
      return <div>Loading . . .</div>;
    }
    return (
      <LayersTreeView
        servers={this.props.servers}
        onExpandServer={(server_id, value) =>
          this.props.expand_server(server_id, value)
        }
        onActivateServer={(server_id, value) =>
          this.props.activate_server(server_id, value)
        }
        onExpandLayer={(server_id, node_id, value) =>
          this.props.expand_folder(server_id, node_id, value)
        }
        onActivateLayer={(server_id, node_id, value) =>
          this.props.activate_folder_or_layer(server_id, node_id, value)
        }
        onContextMenuRequested={({
          server_id,
          node_id,
          anchor_el,
          type,
          label,
          checked,
        }) => {
          const toggle_action =
            type === "server"
              ? activate_server(server_id, !checked)
              : type === "folder"
              ? activate_folder_or_layer(server_id, node_id, !checked)
              : type === "layer"
              ? activate_folder_or_layer(server_id, node_id, !checked)
              : type === "folder_or_layer";
          // Add data of an action to be dispatched (create the action here, and pass it.).
          this.props.context_menu_open(anchor_el, [
            {
              label: `Toggle "${label}"`,
              action: toggle_action,
            },
          ]);
        }}
      />
    );
  }
}
LayersTreeViewWithLogic.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onError: PropTypes.func,
  servers: PropTypes.array,
};

const mapStateToProps = (state) => ({
  servers: state.servers || {},
});

const mapDispatchToProps = {
  activate_folder_or_layer,
  activate_server,
  error_message,
  expand_folder,
  expand_server,
  refresh_layers_for_server,
  context_menu_open,
};

// Having `WithData` implies `WithLogic`
const LayersTreeViewWithData = connect(
  mapStateToProps,
  mapDispatchToProps
)(LayersTreeViewWithLogic);
LayersTreeViewWithData.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onError: PropTypes.func,
};

export default LayersTreeViewWithData;
