import { Logger } from "@mocha/shared";
import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";

const logger = new Logger("serve");

interface DevToolsServer {
  server: http.Server;
  port: number;
}

class DevToolsBackend {
  private server: http.Server | null = null;
  private port: number;
  private connections: Set<http.ServerResponse> = new Set();
  private inspectionData = {
    componentTree: {} as any,
    properties: {} as Record<string, any>,
    signalGraph: [] as any[],
    threadInfo: {} as any,
    snapshots: [] as Array<{ time: number; state: any }>,
  };

  constructor(port: number) {
    this.port = port;
  }

  start(): void {
    this.server = http.createServer((req, res) => {
      this._handleRequest(req, res);
    });

    this.server.listen(this.port, () => {
      logger.info(`DevTools server at http://localhost:${this.port}`);
    });
  }

  stop(): void {
    this.server?.close();
    this.connections.clear();
    logger.info("DevTools server stopped");
  }

  updateComponentTree(tree: any): void {
    this.inspectionData.componentTree = tree;
    this._broadcast("component-tree", tree);
  }

  updateProperties(properties: Record<string, any>): void {
    this.inspectionData.properties = properties;
    this._broadcast("properties", properties);
  }

  updateSignalGraph(graph: any[]): void {
    this.inspectionData.signalGraph = graph;
    this._broadcast("signal-graph", graph);
  }

  updateThreadInfo(info: any): void {
    this.inspectionData.threadInfo = info;
    this._broadcast("thread-info", info);
  }

  takeSnapshot(): void {
    this.inspectionData.snapshots.push({
      time: Date.now(),
      state: JSON.parse(JSON.stringify(this.inspectionData.properties)),
    });
    this._broadcast("snapshot", this.inspectionData.snapshots);
  }

  private _handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = req.url ?? "/";

    if (url === "/events") {
      this._handleSSE(req, res);
      return;
    }

    if (url === "/state") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(this.inspectionData));
      return;
    }

    if (url === "/snapshot" && req.method === "POST") {
      this.takeSnapshot();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(this._getDevToolsHTML());
  }

  private _handleSSE(req: http.IncomingMessage, res: http.ServerResponse): void {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    res.write("data: " + JSON.stringify({ type: "connected" }) + "\n\n");

    this.connections.add(res);

    req.on("close", () => {
      this.connections.delete(res);
    });
  }

  private _broadcast(type: string, data: any): void {
    const message = JSON.stringify({ type, data });
    for (const conn of this.connections) {
      conn.write(`data: ${message}\n\n`);
    }
  }

  private _getDevToolsHTML(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mocha DevTools</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: system-ui; background: #0d1117; color: #c9d1d9; display:flex; height:100vh; }
    .sidebar { width:240px; background:#161b22; border-right:1px solid #30363d; padding:16px; overflow-y:auto; }
    .sidebar h2 { font-size:14px; color:#8b949e; margin-bottom:12px; text-transform:uppercase; letter-spacing:1px; }
    .sidebar button { display:block; width:100%; padding:8px 12px; margin-bottom:4px; background:none; border:none; color:#c9d1d9; text-align:left; border-radius:6px; cursor:pointer; font-size:13px; }
    .sidebar button:hover { background:#1c2128; }
    .sidebar button.active { background:#1f6feb33; color:#58a6ff; }
    .main { flex:1; display:flex; flex-direction:column; overflow:hidden; }
    .toolbar { background:#161b22; border-bottom:1px solid #30363d; padding:8px 16px; display:flex; gap:8px; align-items:center; }
    .toolbar .dot { width:8px; height:8px; border-radius:50%; }
    .toolbar .dot.connected { background:#3fb950; }
    .toolbar .dot.disconnected { background:#f85149; }
    .content { flex:1; padding:16px; overflow-y:auto; }
    .panel { display:none; }
    .panel.active { display:block; }
    .card { background:#161b22; border:1px solid #30363d; border-radius:8px; padding:16px; margin-bottom:12px; }
    .card h3 { font-size:14px; margin-bottom:8px; color:#58a6ff; }
    .property-row { display:flex; justify-content:space-between; padding:4px 0; font-size:13px; border-bottom:1px solid #21262d; }
    .property-row .label { color:#8b949e; }
    .property-row .value { color:#c9d1d9; font-family: monospace; }
    pre { background:#0d1117; padding:12px; border-radius:6px; font-size:12px; overflow-x:auto; }
  </style>
</head>
<body>
  <div class="sidebar">
    <h2>Mocha DevTools</h2>
    <button class="active" data-panel="component-tree">🔍 Component Tree</button>
    <button data-panel="properties">📊 Properties</button>
    <button data-panel="signals">⚡ Signal Graph</button>
    <button data-panel="threads">🧵 Thread Monitor</button>
    <button data-panel="snapshots">🐛 Snapshots</button>
  </div>
  <div class="main">
    <div class="toolbar">
      <span id="status-text">Disconnected</span>
    </div>
    <div class="content">
      <div id="component-tree" class="panel active">
        <div class="card"><h3>Component Tree</h3><pre id="tree-data">Waiting for data...</pre></div>
      </div>
      <div id="properties" class="panel">
        <div class="card"><h3>Properties</h3><div id="props-data">Waiting for data...</div></div>
      </div>
      <div id="signals" class="panel">
        <div class="card"><h3>Signal/Slot Graph</h3><pre id="signals-data">Waiting for data...</pre></div>
      </div>
      <div id="threads" class="panel">
        <div class="card"><h3>Thread Monitor</h3><pre id="threads-data">Waiting for data...</pre></div>
      </div>
      <div id="snapshots" class="panel">
        <div class="card">
          <h3>Property Snapshots</h3>
          <button id="take-snapshot" style="padding:6px 12px; background:#238636; color:white; border:none; border-radius:6px; cursor:pointer;">Take Snapshot</button>
          <pre id="snapshots-data" style="margin-top:12px;">No snapshots</pre>
        </div>
      </div>
    </div>
  </div>
  <script>
    const eventSource = new EventSource('/events');
    eventSource.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      document.getElementById('status-text').textContent = 'Connected';
      document.getElementById('status-text').style.color = '#3fb950';

      if (msg.type === 'component-tree') {
        document.getElementById('tree-data').textContent = JSON.stringify(msg.data, null, 2);
      } else if (msg.type === 'properties') {
        const rows = Object.entries(msg.data).map(([k,v]) =>
          '<div class="property-row"><span class="label">' + k + '</span><span class="value">' + JSON.stringify(v) + '</span></div>'
        ).join('');
        document.getElementById('props-data').innerHTML = rows;
      } else if (msg.type === 'signal-graph') {
        document.getElementById('signals-data').textContent = JSON.stringify(msg.data, null, 2);
      } else if (msg.type === 'thread-info') {
        document.getElementById('threads-data').textContent = JSON.stringify(msg.data, null, 2);
      } else if (msg.type === 'snapshot') {
        document.getElementById('snapshots-data').textContent = JSON.stringify(msg.data, null, 2);
      }
    };
    eventSource.onerror = () => {
      document.getElementById('status-text').textContent = 'Disconnected';
      document.getElementById('status-text').style.color = '#f85149';
    };

    document.querySelectorAll('.sidebar button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.panel).classList.add('active');
      });
    });

    document.getElementById('take-snapshot')?.addEventListener('click', async () => {
      await fetch('/snapshot', { method: 'POST' });
    });
  </script>
</body>
</html>`;
  }
}

export async function run(args: string[]): Promise<void> {
  const portIndex = args.indexOf("--port") >= 0
    ? args.indexOf("--port")
    : args.indexOf("-p") >= 0
      ? args.indexOf("-p")
      : -1;
  const port = portIndex >= 0 ? parseInt(args[portIndex + 1], 10) : 9229;

  const devTools = new DevToolsBackend(port);
  devTools.start();

  process.on("SIGINT", () => {
    devTools.stop();
    process.exit(0);
  });
}
