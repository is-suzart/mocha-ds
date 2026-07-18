import { QObject, QProperty } from "@mocha/core";
import { Logger } from "@mocha/shared";
import { QMLTemplateParser, type ParsedQMLDocument, type QMLBindingMap } from "./qml-parser.js";
import { BindingEngine } from "./binding.js";

const logger = new Logger("QMLComponent");
const parser = new QMLTemplateParser();

export interface QMLComponentOptions {
  qml: string;
  imports?: string[];
  autoBind?: boolean;
  hotReload?: boolean;
  providedIn?: "root" | "view";
}

export interface QMLComponentMetadata {
  options: QMLComponentOptions;
  document: ParsedQMLDocument;
  bindings: QMLBindingMap;
  componentName: string;
  providedIn: "root" | "view";
}

const componentRegistry = new Map<Function, QMLComponentMetadata>();

export interface ProxyEntry {
  proxyId: number;
  instance: QObject;
  componentName: string;
}

export function QMLComponent(options: QMLComponentOptions) {
  return function <T extends { new (...args: any[]): any }>(target: T): T {
    const componentName = target.name;
    const document = parser.parse(options.qml);
    const bindings = parser.generateBindings(document, "controller");

    const metadata: QMLComponentMetadata = {
      options,
      document,
      bindings,
      componentName,
      providedIn: options.providedIn || "view",
    };

    componentRegistry.set(target, metadata);
    logger.debug(`Registered QML component: ${componentName}`);

    (target as any).__qmlComponent = metadata;
    (target as any).__qmlTemplate = options.qml;
    (target as any).__qmlDocument = document;
    (target as any).__qmlBindings = bindings;

    return target;
  };
}

export function getQMLComponentMetadata(
  component: Function
): QMLComponentMetadata | undefined {
  return componentRegistry.get(component);
}

export function getAllQMLComponents(): Map<Function, QMLComponentMetadata> {
  return new Map(componentRegistry);
}

function isMethodCall(expr: string): boolean {
  return /\.\w+\s*\(/.test(expr);
}

function transformExpression(expr: string, contextName: string): string {
  const propertyMatch = expr.match(/^controller\.(\w+)\.(value|get)\(\)$/);
  if (propertyMatch) {
    return `${contextName}.get("${propertyMatch[1]}")`;
  }

  const methodMatch = expr.match(/^controller\.(\w+)\s*\(/);
  if (methodMatch) {
    return `${contextName}.__call("${methodMatch[1]}")`;
  }

  const simplePropertyMatch = expr.match(/^controller\.(\w+)$/);
  if (simplePropertyMatch) {
    return `${contextName}.get("${simplePropertyMatch[1]}")`;
  }

  return expr;
}

export function generateQMLSource(
  component: QObject,
  metadata: QMLComponentMetadata,
  rootProxies?: ProxyEntry[]
): string {
  let qml = metadata.options.qml;

  // Transform controller.xxx bindings for root proxies
  if (rootProxies && rootProxies.length > 0) {
    for (const [key, binding] of Object.entries(metadata.bindings)) {
      const contextName = "controller";
      const transformed = transformExpression(binding.expression, contextName);
      if (transformed !== binding.expression) {
        qml = qml.replace(binding.expression, transformed);
      } else {
        // Fallback: still try to replace with static value
        const propPath = binding.expression.replace(/^controller\./, "").replace(/\.(value|get)\(\)$/, "");
        const value = propPath
          .split(".")
          .reduce((obj: any, part) => {
            if (typeof obj === "object" && part in obj) {
              const val = obj[part];
              return val instanceof QProperty ? val.value : val;
            }
            return undefined;
          }, component);

        if (value !== undefined) {
          const jsonValue = JSON.stringify(value);
          qml = qml.replace(binding.expression, jsonValue);
        }
      }
    }

    // Add __seq bridge for each root proxy component
    for (const proxy of rootProxies) {
      const bridgeExpr = `readonly property int __bridge_${proxy.componentName}: ${proxy.componentName}.__seq`;
      if (!qml.includes(bridgeExpr)) {
        // Inject bridge into the root QML element
        const rootElMatch = qml.match(/^(\w+\s*\{[\s\S]*?)(?=\n\s+\w+[\s\S]*)/m);
        if (rootElMatch) {
          qml = qml.replace(
            rootElMatch[0],
            `${rootElMatch[1]}\n    ${bridgeExpr}`
          );
        }
      }
    }
  } else {
    // No proxies — static value replacement (legacy behavior)
    for (const [key, binding] of Object.entries(metadata.bindings)) {
      const propPath = binding.expression.replace(/^controller\./, "").replace(/\.(value|get)\(\)$/, "");
      const value = propPath
        .split(".")
        .reduce((obj: any, part) => {
          if (typeof obj === "object" && part in obj) {
            const val = obj[part];
            return val instanceof QProperty ? val.value : val;
          }
          return undefined;
        }, component);

      if (value !== undefined) {
        const jsonValue = JSON.stringify(value);
        qml = qml.replace(binding.expression, jsonValue);
      }
    }
  }

  return qml;
}

export function generateQMLFile(
  component: QObject,
  metadata: QMLComponentMetadata
): string {
  const header = [
    "import QtQuick 2.15",
    "import QtQuick.Controls 2.15",
    "import QtQuick.Layouts 1.15",
  ].join("\n");

  const body = generateQMLSource(component, metadata);

  return `${header}\n\n${body}`;
}
