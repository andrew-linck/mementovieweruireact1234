import {
  REFRESH_LAYERS_FOR_SERVER,
  REMOVE_SERVER,
  EXPAND_SERVER,
  EXPAND_FOLDER,
  ACTIVATE_SERVER,
  ACTIVATE_FOLDER_OR_LAYER,
  REMOVE_ITEM,
  INSERT_ITEM,
  ADD_FOLDER,
} from "../actions/types";
import { dot_list_to_dot_hierarchy, folders_from_dot_hierarchy } from "../util";
import _ from "lodash";

export const servers = (state, action) => {
  if (state === undefined) {
    state = [];
  }
  switch (action.type) {
    case REFRESH_LAYERS_FOR_SERVER:
      {
        let server = state.find(
          (server) => server.base_url === action.payload.server
        );
        const layer_keys = action.payload.layers.map((layer) => layer.name);
        const layers_tree = dot_list_to_dot_hierarchy(layer_keys);
        const folder_keys = folders_from_dot_hierarchy(layers_tree);

        // If we don't have an entry for this server, make one.
        if (!server) {
          server = {
            base_url: action.payload.server,
            name: action.payload.name,
            title: action.payload.title,
            extents: action.payload.extents,
            active: true,
            expanded: false,
            active_keys: [],
            expanded_keys: [],
            all_layer_keys: [],
            all_folder_keys: [],
            layers_tree,
          };
          state = [...state, server];
        }

        // Merge the new folders with the old folders.
        const folders_to_add = _.difference(
          folder_keys,
          server.all_folder_keys
        );
        const folders_to_remove = _.difference(
          server.all_folder_keys,
          folder_keys
        );
        // console.log({folders_to_add, folders_to_remove});
        if (folders_to_add.length > 0) {
          server.active_keys = _.union(
            server.active_keys,
            folders_to_add
          ).sort();
          // server.expanded_keys = _.union(server.expanded_keys, folders_to_add).sort();
          server.all_folder_keys = _.union(
            server.all_folder_keys,
            folders_to_add
          ).sort();
        }
        if (folders_to_remove.length > 0) {
          _.pullAll(server.active_keys, folders_to_remove);
          _.pullAll(server.expanded_keys, folders_to_remove);
          _.pullAll(server.all_folder_keys, folders_to_remove);
        }

        // Merge the new layers with the old layers.
        const layers_to_add = _.difference(layer_keys, server.all_layer_keys);
        const layers_to_remove = _.difference(
          server.all_layer_keys,
          layer_keys
        );
        //console.log({layers_to_add, layers_to_remove});
        if (layers_to_add.length > 0) {
          server.active_keys = _.union(
            server.active_keys,
            layers_to_add
          ).sort();
          server.all_layer_keys = _.union(
            server.all_layer_keys,
            layers_to_add
          ).sort();
        }
        if (layers_to_remove.length > 0) {
          _.pullAll(server.active_keys, layers_to_remove);
          _.pullAll(server.all_layer_keys, layers_to_remove);
        }
      }
      break;

    case REMOVE_SERVER:
      {
        state = state.filter((server_entry) => {
          return server_entry.base_url !== action.payload.server;
        });
      }
      break;

    case EXPAND_SERVER:
      {
        const server = state.find(
          (server) => server.base_url === action.payload.server_id
        );
        if (!server) {
          break;
        }
        server.expanded = action.payload.value;
        state = [...state];
      }
      break;

    case EXPAND_FOLDER:
      {
        const server = state.find(
          (server) => server.base_url === action.payload.server_id
        );
        if (!server) {
          break;
        }
        if (action.payload.value) {
          server.expanded_keys = _.union(server.expanded_keys, [
            action.payload.node_id,
          ]).sort();
        } else {
          server.expanded_keys = _.without(
            server.expanded_keys,
            action.payload.node_id
          );
        }
        state = [...state];
      }
      break;

    case ACTIVATE_SERVER:
      {
        const server = state.find(
          (server) => server.base_url === action.payload.server_id
        );
        if (!server) {
          break;
        }
        if (action.payload.value) {
          server.active = true;
          server.active_keys = _.union(
            server.all_folder_keys,
            server.all_layer_keys
          ).sort();
        } else {
          server.active = false;
          server.active_keys = [];
        }
        state = [...state];
      }
      break;

    case ACTIVATE_FOLDER_OR_LAYER:
      {
        const server = state.find(
          (server) => server.base_url === action.payload.server_id
        );
        if (!server) {
          break;
        }
        if (action.payload.value) {
          server.active = true;
          const prefix_filter = (key) =>
            _.startsWith(key, action.payload.node_id) ||
            _.startsWith(action.payload.node_id, key);
          const prefixed_keys = [
            ...server.all_folder_keys.filter(prefix_filter),
            ...server.all_layer_keys.filter(prefix_filter),
          ];
          server.active_keys = _.union(
            server.active_keys,
            prefixed_keys
          ).sort();
        } else {
          const prefix_filter = (key) =>
            _.startsWith(key, action.payload.node_id);
          const prefixed_keys = [
            ...server.all_folder_keys.filter(prefix_filter),
            ...server.all_layer_keys.filter(prefix_filter),
          ];
          server.active_keys = _.without(server.active_keys, ...prefixed_keys);
        }
        state = [...state];
      }
      break;

    case REMOVE_ITEM:
      {
        // put state on server const
        const server = state[0];
        server.all_folder_keys = server.all_folder_keys.filter(
          (folder) => folder !== action.payload
        );

        server.all_layer_keys = server.all_layer_keys.filter(
          (layer) => layer !== action.payload
        );

        server.layers_tree.forEach((item, index) => {
          if (item.full_name === action.payload) {
            server.layers_tree.splice(index, 1);
          } else if (item.items) {
            item.items.forEach((nextItem, nextIndex) => {
              if (nextItem.full_name === action.payload) {
                server.layers_tree[index].items.splice(nextIndex, 1);
              } else if (nextItem.items) {
                nextItem.items.forEach((newItem, newIndex) => {
                  if (newItem.full_name === action.payload) {
                    server.layers_tree[index].items[nextIndex].items.splice(
                      newIndex,
                      1
                    );
                  }
                });
              }
            });
          }
        });
        state = [...state];
      }
      break;

    case INSERT_ITEM:
      {
        // put state on server const
        const server = state[0];
        server.all_layer_keys.push(action.payload2.item_name);
        server.active_keys.push(action.payload2.item_name);
        if (action.payload === "PDF Maps") {
          server.layers_tree.push(action.payload2);
        }

        server.layers_tree.forEach((item, index) => {
          if (item.full_name === action.payload) {
            server.layers_tree[index].items.push(action.payload2);
          } else if (item.items) {
            item.items.forEach((nextItem, nextIndex) => {
              if (nextItem.full_name === action.payload) {
                server.layers_tree[index].items[nextIndex].items.push(
                  action.payload2
                );
              } else if (nextItem.items) {
                nextItem.items.forEach((newItem, newIndex) => {
                  if (newItem.full_name === action.payload) {
                    server.layers_tree[index].items[nextIndex].items.push(
                      action.payload2
                    );
                  }
                });
              }
            });
          }
        });
        state = [...state];
      }
      break;

    case ADD_FOLDER:
      {
        // put state on server const
        const server = state[0];
        server.active_keys.push(action.payload2.item_name);
        server.all_folder_keys.push(action.payload2.item_name);
        if (action.payload === "PDF Maps") {
          server.layers_tree.push(action.payload2);
        }

        server.layers_tree.forEach((item, index) => {
          if (item.full_name === action.payload) {
            server.layers_tree[index].items.push(action.payload2);
          } else if (item.items) {
            item.items.forEach((nextItem, nextIndex) => {
              if (nextItem.full_name === action.payload) {
                server.layers_tree[index].items[nextIndex].items.push(
                  action.payload2
                );
              } else if (nextItem.items) {
                nextItem.items.forEach((newItem, newIndex) => {
                  if (newItem.full_name === action.payload) {
                    server.layers_tree[index].items[nextIndex].items.push(
                      action.payload2
                    );
                  }
                });
              }
            });
          }
        });
        state = [...state];
      }
      break;

    default:
      break;
  }
  return state;
};
