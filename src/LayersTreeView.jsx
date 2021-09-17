import React from 'react';
import PropTypes from 'prop-types';
import TreeView from '@material-ui/lab/TreeView';
import LayersTreeItem from './LayersTreeItem';
import _ from 'lodash';

export default function LayersTreeView({
  onExpandServer,
  onActivateServer,
  onExpandLayer,
  onActivateLayer,
  onContextMenuRequested,
  servers,
}) {
  const all_servers_expanded_keys = _.chain(servers)
    .map((server) => {
      const server_expanded_keys = [];
      if (server.expanded) {
        server_expanded_keys.push(server.base_url);
      }
      server.expanded_keys.forEach(
        (key) => server_expanded_keys.push(`${server.base_url}::::${key}`)
      );
      return server_expanded_keys;
    })
    .flatten()
    .value();

  const _call_boolean_op = (server_op, layer_op, server, nodeId, value) => {
    if (nodeId === server.base_url) {
      server_op(nodeId, value);
      return;
    }
    // "+ 4" for "::::"
    const server_specific_node_id = nodeId.substr(server.base_url.length + 4);
    layer_op(server.base_url, server_specific_node_id, value);
  };

  const _on_expanded = (server, nodeId, expanded) => {
    _call_boolean_op(onExpandServer, onExpandLayer, server, nodeId, expanded);
  };

  const _on_activated = (server, nodeId, activated) => {
    _call_boolean_op(onActivateServer, onActivateLayer, server, nodeId, activated);
  };

  const _on_context_menu_requested = (server, nodeId, item) => {
    if (nodeId === server.base_url) {
      item.server_id = server.base_url;
      item.node_id = nodeId;
      onContextMenuRequested(item);
      return;
    }
    // "+ 4" for "::::"
    const server_specific_node_id = nodeId.substr(server.base_url.length + 4);
    item.server_id = server.base_url;
    item.node_id = server_specific_node_id;
    onContextMenuRequested(item);
  };

  const _render_layers_tree_items = (server, layers, active_set) => {
    if (!layers) {
      return null;
    }
    return layers.map((layer) => {
      const _checked = active_set.has(layer.full_name);
      const nodeId = `${server.base_url}::::${layer.full_name}`;

      return (
        <LayersTreeItem
          key={nodeId}
          nodeId={nodeId}
          serverId={server.base_url}
          type={!layer.items ? "layer" : "folder"}
          label={layer.item_name}
          checked={_checked}
          onChecked={(nodeId, checked) => _on_activated(server, nodeId, checked)}
          onExpanded={(nodeId, expanded) => _on_expanded(server, nodeId, expanded)}
          onContextMenuRequested={(nodeId, item) => _on_context_menu_requested(server, nodeId, item)}
        >
          {_render_layers_tree_items(server, layer.items, active_set)}
        </LayersTreeItem>
      );
    });
  };

  const _render_server_tree_items = (servers) => {
    return servers.map((server) => {
      const active_set = new Set(server.active_keys);

      return (
        <LayersTreeItem
          key={server.base_url}
          nodeId={server.base_url}
          serverId={server.base_url}
          type={"server"}
          label={server.name || server.base_url}
          checked={server.active}
          onChecked={(nodeId, checked) => _on_activated(server, nodeId, checked)}
          onExpanded={(nodeId, expanded) => _on_expanded(server, nodeId, expanded)}
          onContextMenuRequested={onContextMenuRequested}
        >
          {_render_layers_tree_items(server, server.layers_tree, active_set)}
        </LayersTreeItem>
      );
    });
  };

  return (
    <TreeView
      className="layers_tree_view"
      expanded={all_servers_expanded_keys}
    >
      {_render_server_tree_items(servers)}
    </TreeView>
  );
}
LayersTreeView.propTypes = {
  onExpandServer: PropTypes.func.isRequired,
  onActivateServer: PropTypes.func.isRequired,
  onExpandLayer: PropTypes.func.isRequired,
  onActivateLayer: PropTypes.func.isRequired,
  onContextMenuRequested: PropTypes.func.isRequired,
  servers: PropTypes.array.isRequired,
};
