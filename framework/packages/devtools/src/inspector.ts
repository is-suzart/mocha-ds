import { QObject, QProperty, Signal } from "@mocha/core";
import { Logger } from "@mocha/shared";

const logger = new Logger("Inspector");

export interface ComponentNode {
  id: number;
  name: string;
  className: string;
  children: ComponentNode[];
  properties: Record<string, unknown>;
  signals: string[];
}

export class ComponentInspector {
  private _roots: ComponentNode[] = [];
  private _onUpdate: ((tree: ComponentNode[]) => void) | null = null;

  setUpdateCallback(callback: (tree: ComponentNode[]) => void): void {
    this._onUpdate = callback;
  }

  inspect(root: QObject): ComponentNode {
    const node = this._buildTree(root);
    this._roots = [node];
    this._onUpdate?.(this._roots);
    return node;
  }

  inspectMultiple(roots: QObject[]): ComponentNode[] {
    this._roots = roots.map((r) => this._buildTree(r));
    this._onUpdate?.(this._roots);
    return this._roots;
  }

  getTree(): ComponentNode[] {
    return this._roots;
  }

  findNode(id: number): ComponentNode | null {
    return this._findInNodes(this._roots, id);
  }

  private _buildTree(obj: QObject): ComponentNode {
    const properties: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      const value = (obj as any)[key];
      if (value instanceof QProperty) {
        properties[key] = value.value;
      } else if (value instanceof Signal) {
        properties[key] = `[Signal: ${value.connectionCount} connections]`;
      } else if (
        typeof value !== "function" &&
        !key.startsWith("_")
      ) {
        properties[key] = value;
      }
    }

    const signals = Object.keys(obj)
      .filter((key) => (obj as any)[key] instanceof Signal);

    return {
      id: obj.objectId,
      name: obj.objectName,
      className: obj.constructor.name,
      children: obj.children.map((child) => this._buildTree(child)),
      properties,
      signals,
    };
  }

  private _findInNodes(
    nodes: ComponentNode[],
    id: number
  ): ComponentNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = this._findInNodes(node.children, id);
      if (found) return found;
    }
    return null;
  }
}
