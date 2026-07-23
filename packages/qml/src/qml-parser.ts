export interface ParsedQMLNode {
  type: string;
  id?: string;
  properties: Record<string, any>;
  children: ParsedQMLNode[];
  signalHandlers: Record<string, string>;
  sourceLocation?: { line: number; column: number };
}

export interface ParsedQMLDocument {
  imports: string[];
  root: ParsedQMLNode;
}

export class QMLTemplateParser {
  parse(template: string): ParsedQMLDocument {
    const trimmed = template.trim();
    const imports: string[] = [];
    const importRegex = /^[ \t]*import\s+(.+?)(?:\s*;)?\s*$/gm;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(trimmed)) !== null) {
      imports.push(match[1].trim());
    }

    const cleanTemplate = trimmed.replace(importRegex, "").trim();
    const normalizedTemplate = this._normalizeQML(cleanTemplate);
    const root = this._parseNode(normalizedTemplate);

    return { imports, root };
  }

  generateBindings(
    document: ParsedQMLDocument,
    componentId: string
  ): QMLBindingMap {
    const bindings: QMLBindingMap = {};
    this._collectBindings(document.root, componentId, bindings);
    return bindings;
  }

  private _normalizeQML(qml: string): string {
    let result = "";
    let inString = false;
    let stringChar = "";
    for (let i = 0; i < qml.length; i++) {
      const char = qml[i];
      if ((char === '"' || char === "'") && (i === 0 || qml[i - 1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (stringChar === char) {
          inString = false;
        }
      }
      
      if (!inString) {
        if (char === "{") {
          result += "{\n";
        } else if (char === "}") {
          result += "\n}\n";
        } else if (char === ";") {
          result += ";\n";
        } else {
          result += char;
        }
      } else {
        result += char;
      }
    }
    return result;
  }

  private _parseNode(qml: string): ParsedQMLNode {
    const lines = qml.split("\n").map((l) => l.trim()).filter(Boolean);
    const typeMatch = lines[0]?.match(/^(\w+)\s*\{/);
    if (!typeMatch) {
      return { type: "Item", properties: {}, children: [], signalHandlers: {} };
    }

    const node: ParsedQMLNode = {
      type: typeMatch[1],
      properties: {},
      children: [],
      signalHandlers: {},
    };

    let braceCount = 0;
    let propertyContent = "";
    let inNode = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes("id:")) {
        const idMatch = line.match(/id:\s*(\w+)/);
        if (idMatch) node.id = idMatch[1];
      }

      if (line.match(/^\w+\s*\{/) && braceCount >= 0) {
        if (braceCount === 0 && i === 0) {
          braceCount++;
          continue;
        }
        if (i > 0) {
          const { block: childQML, endIndex } = this._extractBlock(lines, i);
          node.children.push(this._parseNode(childQML));
          i = endIndex;
          continue;
        }
      }

      const inlineObjectMatch = line.match(/^(\w+)\s*:\s*(\w+)\s*\{/);
      if (inlineObjectMatch && braceCount >= 1) {
        const [, propName, childType] = inlineObjectMatch;
        const { block: rawBlock, endIndex } = this._extractBlock(lines, i);
        let childQML = rawBlock.replace(/^\w+\s*:\s*\w+\s*/, childType + " ");
        node.children.push(this._parseNode(childQML));
        i = endIndex;
        continue;
      }

      if (line.includes("{")) braceCount++;
      if (line.includes("}")) {
        braceCount--;
        if (braceCount <= 0) break;
      }

      if (braceCount === 1) {
        const propMatch = line.match(/^(\w+):\s*(.+)/);
        if (propMatch) {
          const [, key, value] = propMatch;
          if (key.startsWith("on")) {
            node.signalHandlers[key] = value.replace(/;$/, "").trim();
          } else {
            node.properties[key] = this._parseValue(value.replace(/;$/, "").trim());
          }
        }
      }
    }

    return node;
  }

  private _extractBlock(lines: string[], startIdx: number): { block: string; endIndex: number } {
    let braceDepth = 0;
    let endIdx = startIdx;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }
      if (braceDepth === 0) {
        endIdx = i;
        break;
      }
    }

    return {
      block: lines.slice(startIdx, endIdx + 1).join("\n"),
      endIndex: endIdx,
    };
  }

  private _parseValue(raw: string): any {
    if (raw === "true") return true;
    if (raw === "false") return false;
    if (raw === "null") return null;
    if (raw === "undefined") return undefined;

    const num = Number(raw);
    if (!isNaN(num) && raw !== "") return num;

    if (raw.startsWith('"') && raw.endsWith('"')) {
      const inner = raw.slice(1, -1);
      if (inner.includes('"') || inner.includes("'")) {
        return raw;
      }
      return inner;
    }
    if (raw.startsWith("'") && raw.endsWith("'")) {
      const inner = raw.slice(1, -1);
      if (inner.includes('"') || inner.includes("'")) {
        return raw;
      }
      return inner;
    }

    if (raw.startsWith("#")) return raw;

    if (raw.match(/^controller\.\w+(\.(value|get)\(\))?$/)) {
      return { type: "binding", expression: raw };
    }

    return raw;
  }

  private _collectBindings(
    node: ParsedQMLNode,
    componentId: string,
    bindings: QMLBindingMap
  ): void {
    for (const [prop, value] of Object.entries(node.properties)) {
      if (typeof value === "object" && value?.type === "binding") {
        const expr = value.expression as string;
        const key = `${componentId}.${node.id ?? node.type}.${prop}`;
        bindings[key] = {
          expression: expr,
          property: prop,
          nodeId: node.id ?? node.type,
        };
      }
    }

    for (const child of node.children) {
      this._collectBindings(child, componentId, bindings);
    }
  }
}

export interface QMLBinding {
  expression: string;
  property: string;
  nodeId: string;
}

export type QMLBindingMap = Record<string, QMLBinding>;
