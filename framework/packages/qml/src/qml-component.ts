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

export function generateQMLSource(
  component: QObject,
  metadata: QMLComponentMetadata,
  rootProxies?: ProxyEntry[]
): string {
  let qml = metadata.options.qml;

  // Transform controller.xxx bindings via global regex — robust against parser quirks
  qml = qml.replace(/controller\.(\w+)\.value\b/g, 'controller.get("$1")');
  qml = qml.replace(/controller\.(\w+)\s*\(\)/g, 'controller.__call("$1")');

  // If proxies exist, inject __seq bridge for reactive dependency
  if (rootProxies && rootProxies.length > 0) {
    for (const proxy of rootProxies) {
      const bridgeExpr = `readonly property int __bridge_${proxy.componentName}: ${proxy.componentName}.__seq`;
      if (!qml.includes(bridgeExpr)) {
        // Inject bridge into the root QML element (first opening brace)
        const braceIdx = qml.indexOf("{");
        if (braceIdx >= 0) {
          const before = qml.slice(0, braceIdx + 1);
          const after = qml.slice(braceIdx + 1);
          qml = `${before}\n    ${bridgeExpr}${after}`;
        }
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
