import _ from "lodash";

export const sleep = (ms) =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });

export const dot_split = (dot_string) => {
  var arr = dot_string.split(".");
  if (arr.length > 1 && arr[0] === "") {
    arr[0] = ".";
  }
  for (var i = 1; i < arr.length; ++i) {
    if (arr[i] === "") {
      arr[i - 1] += ".";
      if (i + 1 < arr.length) {
        arr[i - 1] += arr[i + 1];
        arr.splice(i + 1, 1);
      }
      arr.splice(i, 1);
    }
  }
  return arr;
};

export const dot_join = (string_list) =>
  string_list.map((segment) => segment.replace(/\./g, "..")).join(".");

export const hierarchy_to_dot_hierarchy = (hierarchy) => {
  return hierarchy.map(({ name, items, ...rest }) => {
    const full_name = dot_join(name);
    const item_name = _.last(name);
    if (!items) {
      return {
        full_name,
        item_name,
        ...rest,
      };
    }
    return {
      full_name,
      item_name,
      items: hierarchy_to_dot_hierarchy(items),
      ...rest,
    };
  });
};

export const dot_list_to_dot_hierarchy = (dot_list) => {
  const list = dot_list.map((item) => dot_split(item));
  const hierarchy = list_to_hierarchy(list, []);
  const dot_hierarchy = hierarchy_to_dot_hierarchy(hierarchy);
  return dot_hierarchy;
};

export const list_to_hierarchy = (list, prefix) => {
  const rank = prefix.length;
  const next_rank = rank + 1;
  const folder_nodes = list.filter((item) => item.length > next_rank);
  const leaf_nodes = list.filter((item) => item.length === next_rank);

  const folder_nodes_grouped = _.groupBy(folder_nodes, (item) => item[rank]);

  return [
    ...Object.keys(folder_nodes_grouped).map((name) => {
      return {
        rank,
        name: [...prefix, name],
        items: list_to_hierarchy(folder_nodes_grouped[name], [...prefix, name]),
      };
    }),
    ...leaf_nodes.map((item) => ({
      rank,
      name: item,
    })),
  ];
};

export const folders_from_dot_hierarchy = (dot_hierarchy) => {
  const folders = [];
  const get_full_names_and_decend = (items) => {
    items.forEach((item) => {
      if (!!item.items) {
        folders.push(item.full_name);
        get_full_names_and_decend(item.items);
      }
    });
  };
  get_full_names_and_decend(dot_hierarchy);
  return folders.sort();
};

/// Make sure that the active key is actually a layer, and not just a folder.
export const active_layers = (server) => {
  const layers = _.intersection(server.active_keys, server.all_layer_keys);
  return layers;
};

export const mvic_base_url = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port === "3000" ? "6003" : window.location.port;
  return `${protocol}//${hostname}:${port}/`;
};

export const os_name = () => {
  let name = "Unknown OS";
  if (navigator.appVersion.indexOf("Win") !== -1) name = "Windows";
  if (navigator.appVersion.indexOf("Mac") !== -1) name = "macOS";
  if (navigator.appVersion.indexOf("X11") !== -1) name = "UNIX";
  if (navigator.appVersion.indexOf("Linux") !== -1) name = "Linux";
  return name;
};
