export default class MementoViewerInternalClient {
  constructor(options) {
    options = options || {};
    this.base_url = options.base_url || "http://northavenue/";
  }

  async selectDirectory() {
    return await fetch(
      `${this.base_url}api/selectDirectory`
    ).then((res) => res.json());
  }

  async viewerLiteCreateDirProgress() {
    return await fetch(
      `${this.base_url}api/viewerLiteCreateDirProgress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      }
    ).then((res) => res.json());
  }

  async viewerLiteCreateDir({dir, scanDir, exeSubDir, layers, extents}) {
    return await fetch(
      `${this.base_url}api/viewerLiteCreateDir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dir,
          scanDir,
          exeSubDir,
          layers,
          extents,
        }),
      }
    ).then((res) => res.json());
  }

  async layers() {
    return await fetch(
      `${this.base_url}memento/publisher/layers`
    ).then((res) => res.json());
  }
}