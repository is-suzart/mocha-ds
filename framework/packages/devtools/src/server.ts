import { Logger } from "@mocha/shared";
import { QObject } from "@mocha/core";
import { ComponentInspector } from "./inspector.js";
import { PropertyInspector } from "./property-inspector.js";
import { SignalGraphBuilder } from "./signal-graph.js";
import { ThreadMonitor } from "./thread-monitor.js";

const logger = new Logger("DevToolsServer");

export interface DevToolsConfig {
  port?: number;
  host?: string;
  enableSignalGraph?: boolean;
  enableThreadMonitor?: boolean;
  snapshotInterval?: number;
}

export class DevToolsServer {
  private _componentInspector: ComponentInspector;
  private _propertyInspector: PropertyInspector;
  private _signalGraph: SignalGraphBuilder;
  private _threadMonitor: ThreadMonitor;
  private _config: DevToolsConfig;

  constructor(config: DevToolsConfig = {}) {
    this._config = {
      port: 9229,
      host: "localhost",
      enableSignalGraph: true,
      enableThreadMonitor: true,
      snapshotInterval: 5000,
      ...config,
    };

    this._componentInspector = new ComponentInspector();
    this._propertyInspector = new PropertyInspector();
    this._signalGraph = new SignalGraphBuilder();
    this._threadMonitor = new ThreadMonitor();
  }

  start(): void {
    logger.info(`DevTools started on port ${this._config.port}`);

    if (this._config.enableThreadMonitor) {
      this._threadMonitor.startPolling(this._config.snapshotInterval);
    }
  }

  stop(): void {
    this._threadMonitor.stopPolling();
    logger.info("DevTools stopped");
  }

  attach(root: QObject): void {
    this._componentInspector.inspect(root);
    this._propertyInspector.watch(root);
    this._signalGraph.buildFrom(root);
    logger.info(`DevTools attached to ${root.objectName}`);
  }

  get componentTree() {
    return this._componentInspector.getTree();
  }

  get propertyState() {
    return this._propertyInspector.getAllProperties();
  }

  get signalGraph() {
    return this._signalGraph.getGraph();
  }

  get threadInfo() {
    return this._threadMonitor.capture();
  }

  takeSnapshot(obj: QObject) {
    return this._propertyInspector.snapshot(obj);
  }

  getSnapshots() {
    return this._propertyInspector.getSnapshots();
  }

  exportSignalGraphAsDOT(): string {
    return this._signalGraph.exportDOT();
  }
}
