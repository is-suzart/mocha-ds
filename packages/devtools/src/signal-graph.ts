import { QObject, Signal } from "@mocha/core";
import { Logger } from "@mocha/shared";

const logger = new Logger("SignalGraph");

export interface SignalNode {
  id: string;
  objectName: string;
  className: string;
  signalName: string;
  connectionCount: number;
}

export interface SlotNode {
  id: string;
  objectName: string;
  className: string;
  methodName: string;
}

export interface SignalConnection {
  id: string;
  source: SignalNode;
  target: SlotNode;
}

export interface SignalGraph {
  signals: SignalNode[];
  slots: SlotNode[];
  connections: SignalConnection[];
}

export class SignalGraphBuilder {
  private _graph: SignalGraph = { signals: [], slots: [], connections: [] };

  buildFrom(root: QObject): SignalGraph {
    this._graph = { signals: [], slots: [], connections: [] };
    this._traverseObject(root);
    return this._graph;
  }

  getGraph(): SignalGraph {
    return { ...this._graph };
  }

  private _traverseObject(obj: QObject): void {
    const signals = Object.entries(obj)
      .filter(([_, val]) => val instanceof Signal);

    for (const [name, signal] of signals) {
      const sigNode: SignalNode = {
        id: `${obj.objectId}_${name}`,
        objectName: obj.objectName,
        className: obj.constructor.name,
        signalName: name,
        connectionCount: (signal as Signal).connectionCount,
      };
      this._graph.signals.push(sigNode);
    }

    for (const child of obj.children) {
      this._traverseObject(child);
    }
  }

  addConnection(
    sourceId: string,
    targetName: string,
    targetClass: string,
    methodName: string
  ): void {
    const source = this._graph.signals.find((s) => s.id === sourceId);
    if (!source) {
      logger.warn(`Signal not found: ${sourceId}`);
      return;
    }

    const slotNode: SlotNode = {
      id: `${targetName}_${methodName}`,
      objectName: targetName,
      className: targetClass,
      methodName,
    };

    const conn: SignalConnection = {
      id: `${sourceId}->${slotNode.id}`,
      source,
      target: slotNode,
    };

    this._graph.slots.push(slotNode);
    this._graph.connections.push(conn);
  }

  exportDOT(): string {
    let dot = "digraph SignalGraph {\n";
    dot += '  rankdir=LR;\n';
    dot += '  node [shape=box, style=filled, fillcolor="#161b22", fontcolor="#c9d1d9"];\n';

    for (const signal of this._graph.signals) {
      dot += `  "${signal.id}" [label="${signal.objectName}\\n${signal.signalName}", fillcolor="#0d419d"];\n`;
    }

    for (const slot of this._graph.slots) {
      dot += `  "${slot.id}" [label="${slot.objectName}\\n${slot.methodName}", fillcolor="#1d5e1d"];\n`;
    }

    for (const conn of this._graph.connections) {
      dot += `  "${conn.source.id}" -> "${conn.target.id}";\n`;
    }

    dot += "}\n";
    return dot;
  }

  exportJSON(): string {
    return JSON.stringify(this._graph, null, 2);
  }
}
