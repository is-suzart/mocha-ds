import * as vscode from "vscode";
import { DebugClient } from "./debug-client";

export class InspectorProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _client: DebugClient;
  private _connected = false;

  constructor(host: string, port: number) {
    this._client = new DebugClient(host, port);
    this._client.onMessage = (type, data) => {
      if (type === "component-tree" || type === "properties" || type === "qml-tree") {
        this._postToWebview({ type, data });
      }
    };
  }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._getHtml();

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      switch (msg.command) {
        case "connect":
          await this._connect();
          break;
        case "disconnect":
          this._disconnect();
          break;
        case "selectNode":
          this._postToWebview({ type: "select", id: msg.id, kind: msg.kind });
          break;
        case "editProperty":
          await this._editProperty(msg.objectId, msg.property, msg.value);
          break;
        case "refresh":
          await this._refresh();
          break;
      }
    });
  }

  private async _connect(): Promise<void> {
    this._client.connectSSE();
    this._connected = true;
    const state = await this._client.getState();
    if (state) {
      this._postToWebview({ type: "connected", data: state });
    } else {
      this._postToWebview({ type: "error", message: "Could not connect to debug server" });
    }
  }

  private _disconnect(): void {
    this._client.disconnectSSE();
    this._connected = false;
    this._postToWebview({ type: "disconnected" });
  }

  private async _refresh(): Promise<void> {
    const state = await this._client.getState();
    if (state) {
      this._postToWebview({ type: "connected", data: state });
    }
  }

  private async _editProperty(objectId: number, property: string, value: string): Promise<void> {
    let parsed: unknown;
    try { parsed = JSON.parse(value); } catch { parsed = value; }
    await this._client.setProperty(objectId, property, parsed);
    await this._refresh();
  }

  private _postToWebview(msg: any): void {
    this._view?.webview.postMessage(msg);
  }

  private _getHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); color: var(--vscode-foreground); background: var(--vscode-sideBar-background); padding: 8px; }
    .toolbar { display:flex; gap:4px; margin-bottom:8px; }
    .toolbar button { padding:4px 8px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border:none; border-radius:3px; cursor:pointer; font-size:11px; }
    .toolbar button:hover { background: var(--vscode-button-hoverBackground); }
    .toolbar button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
    .status { font-size:11px; padding:4px 0; }
    .status.connected { color: var(--vscode-testing-iconPassed); }
    .status.disconnected { color: var(--vscode-errorForeground); }
    .section-label { font-size:10px; font-weight:700; color: var(--vscode-descriptionForeground); text-transform:uppercase; letter-spacing:1px; padding:6px 0 2px; border-bottom:1px solid var(--vscode-panel-border); margin-bottom:4px; }
    .tree-node { margin-left:12px; }
    .tree-header { display:flex; align-items:center; gap:4px; padding:2px 4px; cursor:pointer; border-radius:3px; }
    .tree-header:hover { background: var(--vscode-list-hoverBackground); }
    .tree-header.selected { background: var(--vscode-list-activeSelectionBackground); color: var(--vscode-list-activeSelectionForeground); }
    .badge { font-size:9px; padding:1px 4px; border-radius:2px; font-weight:600; }
    .badge-ts { background: #1f6feb33; color: #58a6ff; }
    .badge-qml { background: #23893333; color: #7ee787; }
    .node-name { font-weight:500; }
    .node-class { color: var(--vscode-descriptionForeground); font-size:11px; margin-left:4px; }
    .props { margin-top:8px; border-top:1px solid var(--vscode-panel-border); padding-top:8px; }
    .prop-row { display:flex; justify-content:space-between; padding:2px 0; font-size:12px; border-bottom:1px solid var(--vscode-panel-border); }
    .prop-name { color: var(--vscode-descriptionForeground); }
    .prop-val { color: var(--vscode-foreground); font-family: var(--vscode-editor-font-family); cursor:pointer; }
    .prop-val:hover { background: var(--vscode-list-hoverBackground); border-radius:2px; }
    .prop-val.reactive { color: var(--vscode-symbolIcon-propertyForeground, #cba6f7); }
    .section-title { font-size:11px; font-weight:600; color: var(--vscode-descriptionForeground); text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px; }
    .empty { color: var(--vscode-descriptionForeground); font-style:italic; padding:8px 0; }
  </style>
</head>
<body>
  <div class="toolbar">
    <button id="btn-connect">Connect</button>
    <button id="btn-disconnect" class="secondary" style="display:none">Disconnect</button>
    <button id="btn-refresh" class="secondary" style="display:none">Refresh</button>
  </div>
  <div class="status disconnected" id="status">Disconnected</div>
  <div id="tree"></div>
  <div class="props" id="props" style="display:none">
    <div class="section-title" id="props-title">Properties</div>
    <div id="props-list"></div>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    let state = { tsTree:[], qmlTree:[], properties:{}, selectedId:null, selectedKind:null };

    document.getElementById('btn-connect').onclick = () => vscode.postMessage({command:'connect'});
    document.getElementById('btn-disconnect').onclick = () => vscode.postMessage({command:'disconnect'});
    document.getElementById('btn-refresh').onclick = () => vscode.postMessage({command:'refresh'});

    window.addEventListener('message', ev => {
      const msg = ev.data;
      if (msg.type === 'connected') {
        document.getElementById('status').className = 'status connected';
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('btn-connect').style.display = 'none';
        document.getElementById('btn-disconnect').style.display = 'inline';
        document.getElementById('btn-refresh').style.display = 'inline';
        state.tsTree = msg.data.componentTree || [];
        state.qmlTree = msg.data.qmlTree || [];
        state.properties = msg.data.properties || {};
        renderTree();
      }
      if (msg.type === 'component-tree') {
        state.tsTree = msg.data || [];
        renderTree();
      }
      if (msg.type === 'qml-tree') {
        state.qmlTree = msg.data || [];
        renderTree();
      }
      if (msg.type === 'properties') {
        state.properties = msg.data || {};
        if (state.selectedId !== null && state.selectedKind === 'ts') renderProps(state.selectedId);
      }
      if (msg.type === 'disconnected') {
        document.getElementById('status').className = 'status disconnected';
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('btn-connect').style.display = 'inline';
        document.getElementById('btn-disconnect').style.display = 'none';
        document.getElementById('btn-refresh').style.display = 'none';
        document.getElementById('tree').innerHTML = '';
        document.getElementById('props').style.display = 'none';
      }
      if (msg.type === 'error') {
        document.getElementById('status').className = 'status disconnected';
        document.getElementById('status').textContent = msg.message || 'Error';
      }
    });

    function renderTree() {
      let html = '';
      if (state.tsTree.length > 0) {
        html += '<div class="section-label">TypeScript Objects</div>';
        html += state.tsTree.map(n => renderTsNode(n)).join('');
      }
      if (state.qmlTree.length > 0) {
        html += '<div class="section-label">QML Widgets</div>';
        html += state.qmlTree.map(n => renderQmlNode(n, '0')).join('');
      }
      if (!html) html = '<div class="empty">No data. Run app with MOCHA_DEVTOOLS=1</div>';
      document.getElementById('tree').innerHTML = html;
    }

    function renderTsNode(node) {
      const hasChildren = node.children && node.children.length > 0;
      const selected = state.selectedId === node.id && state.selectedKind === 'ts';
      let h = '<div class="tree-node">';
      h += '<div class="tree-header' + (selected ? ' selected' : '') + '" data-id="' + node.id + '" data-kind="ts">';
      h += '<span>' + (hasChildren ? '\\u25BC' : '\\u2022') + '</span>';
      h += '<span class="badge badge-ts">TS</span>';
      h += '<span class="node-name">' + esc(node.name || node.className) + '</span>';
      h += '<span class="node-class">' + esc(node.className || '') + '</span>';
      h += '</div>';
      if (hasChildren) h += node.children.map(renderTsNode).join('');
      h += '</div>';
      return h;
    }

    function renderQmlNode(node, path) {
      const hasChildren = node.children && node.children.length > 0;
      const selected = state.selectedId === path && state.selectedKind === 'qml';
      const objName = node.properties && node.properties.objectName ? ' "' + node.properties.objectName + '"' : '';
      const propCount = node.properties ? Object.keys(node.properties).length : 0;
      let h = '<div class="tree-node">';
      h += '<div class="tree-header' + (selected ? ' selected' : '') + '" data-id="' + path + '" data-kind="qml">';
      h += '<span>' + (hasChildren ? '\\u25BC' : '\\u2022') + '</span>';
      h += '<span class="badge badge-qml">QML</span>';
      h += '<span class="node-name">' + esc(node.type) + esc(objName) + '</span>';
      if (propCount > 0) h += '<span class="node-class">' + propCount + ' props</span>';
      h += '</div>';
      if (hasChildren) {
        h += node.children.map((c, i) => renderQmlNode(c, path + '-' + i)).join('');
      }
      h += '</div>';
      return h;
    }

    document.getElementById('tree').addEventListener('click', ev => {
      const header = ev.target.closest('.tree-header');
      if (!header) return;
      const id = header.dataset.id;
      const kind = header.dataset.kind;
      state.selectedId = id;
      state.selectedKind = kind;
      renderTree();
      if (kind === 'ts') {
        renderProps(parseInt(id, 10));
      } else {
        renderQmlProps(id);
      }
      vscode.postMessage({command:'selectNode', id, kind});
    });

    function renderProps(id) {
      const node = findNode(state.tsTree, id);
      if (!node) return;
      document.getElementById('props').style.display = 'block';
      document.getElementById('props-title').textContent = (node.className || '?') + ' Properties';
      const rows = (node.properties || []).map(p => {
        return '<div class="prop-row"><span class="prop-name">' + esc(p.name) + ' <small style="opacity:0.5">' + esc(p.type) + '</small></span><span class="prop-val' + (p.isReactive ? ' reactive' : '') + '" data-obj-id="' + id + '" data-prop="' + esc(p.name) + '" data-val="' + esc(JSON.stringify(p.value)) + '">' + esc(JSON.stringify(p.value)) + '</span></div>';
      }).join('');
      document.getElementById('props-list').innerHTML = rows || '<div class="empty">No properties</div>';
    }

    function renderQmlProps(path) {
      const node = findQmlNode(state.qmlTree, path);
      if (!node) return;
      document.getElementById('props').style.display = 'block';
      document.getElementById('props-title').textContent = node.type + ' Properties';
      if (!node.properties || Object.keys(node.properties).length === 0) {
        document.getElementById('props-list').innerHTML = '<div class="empty">No properties</div>';
        return;
      }
      const rows = Object.entries(node.properties).map(([k, v]) => {
        const display = typeof v === 'object' && v !== null ? (v.type === 'binding' ? v.expression : JSON.stringify(v)) : String(v);
        return '<div class="prop-row"><span class="prop-name">' + esc(k) + '</span><span class="prop-val">' + esc(display) + '</span></div>';
      }).join('');
      document.getElementById('props-list').innerHTML = rows;
    }

    document.getElementById('props-list').addEventListener('click', ev => {
      const val = ev.target.closest('.prop-val');
      if (!val) return;
      if (state.selectedKind !== 'ts') return;
      const objId = parseInt(val.dataset.objId, 10);
      const prop = val.dataset.prop;
      const curVal = val.dataset.val;
      if (!prop || objId == null || isNaN(objId)) return;
      let parsed;
      try { parsed = JSON.parse(curVal); } catch { parsed = curVal; }
      const newVal = prompt('Edit ' + prop, typeof parsed === 'string' ? parsed : JSON.stringify(parsed));
      if (newVal === null) return;
      vscode.postMessage({command:'editProperty', objectId:objId, property:prop, value:newVal});
    });

    function findNode(nodes, id) {
      for (const n of (nodes || [])) {
        if (n.id === id) return n;
        const f = findNode(n.children || [], id);
        if (f) return f;
      }
      return null;
    }

    function findQmlNode(nodes, path) {
      const parts = path.split('-').map(Number);
      let current = nodes[parts[0]];
      for (let i = 1; i < parts.length; i++) {
        if (!current || !current.children) return null;
        current = current.children[parts[i]];
      }
      return current;
    }

    function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  </script>
</body>
</html>`;
  }
}
