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
}

export interface QMLComponentMetadata {
  options: QMLComponentOptions;
  document: ParsedQMLDocument;
  bindings: QMLBindingMap;
  componentName: string;
}

const componentRegistry = new Map<Function, QMLComponentMetadata>();

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
  metadata: QMLComponentMetadata
): string {
  let qml = metadata.options.qml;

  for (const [key, binding] of Object.entries(metadata.bindings)) {
    const propPath = binding.expression.replace(/^controller\./, "");
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
