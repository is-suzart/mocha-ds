import { createRequire } from "node:module";

const _require = createRequire(import.meta.url);

export interface QPropertyMeta {
  name: string;
  type: string;
  isComputed: boolean;
  initialValue?: unknown;
}

export interface InjectionMeta {
  name: string;
  token: string;
}

export interface ControllerMeta {
  className: string;
  qproperties: QPropertyMeta[];
  injections: InjectionMeta[];
  methods: string[];
  viewChildren: string[];
  qmlTemplate: string;
  imports: string[];
  autoBind: boolean;
  providedIn: "root" | "view";
  appMeta?: Record<string, unknown>;
  platform: string;
}

export function parseController(target: any): ControllerMeta {
  const className = target.name || "UnknownComponent";
  const meta = (target as any).__qmlComponent;
  const qmlTemplate = (target as any).__qmlTemplate || meta?.options?.qml || "";
  const autoBind = meta?.options?.autoBind ?? false;
  const providedIn = meta?.providedIn ?? "view";
  const platform = meta?.platform ?? "desktop";

  const qproperties = scanQProperties(target);
  const computedProps = scanComputedProps(target);
  const allProps = [...qproperties, ...computedProps];

  let injections: InjectionMeta[] = [];
  let methods: string[] = [];
  let viewChildren: string[] = [];

  let instance: any = null;
  try {
    instance = new target();
    injections = detectInjections(instance, allProps.map(p => p.name));
    methods = detectMethods(instance, className);
    viewChildren = detectViewChildren(instance);

    for (const prop of allProps) {
      try {
        const val = instance[prop.name];
        if (val && typeof val === "object" && "_value" in val) {
          prop.initialValue = val._value;
        } else if (val !== undefined && val !== null) {
          prop.initialValue = val;
        }
      } catch {}
    }
  } catch (_e) {
    injections = [];
    methods = scanMethodsFromProto(target);
    viewChildren = [];
  }

  const imports = extractImports(qmlTemplate);

  return {
    className,
    qproperties: allProps,
    injections,
    methods,
    viewChildren,
    qmlTemplate,
    imports,
    autoBind,
    providedIn,
    platform,
  };
}

function scanQProperties(target: any): QPropertyMeta[] {
  const props: QPropertyMeta[] = [];
  const visited = new Set<string>();

  const startProto = target.prototype || target;
  let proto = startProto;
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key.startsWith("__qproperty_")) {
        const propName = key.replace("__qproperty_", "");
        if (visited.has(propName)) continue;
        visited.add(propName);
        props.push({ name: propName, type: "unknown", isComputed: false });
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  return props;
}

function scanComputedProps(target: any): QPropertyMeta[] {
  const props: QPropertyMeta[] = [];
  const visited = new Set<string>();

  const startProto = target.prototype || target;
  let proto = startProto;
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key.startsWith("__qcomputed_")) {
        const propName = key.replace("__qcomputed_", "");
        if (visited.has(propName)) continue;
        visited.add(propName);
        props.push({ name: propName, type: "unknown", isComputed: true });
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  return props;
}

function detectInjections(instance: any, qpropNames: string[]): InjectionMeta[] {
  const injections: InjectionMeta[] = [];
  const visited = new Set(qpropNames);

  const skipKeys = new Set([
    "objectId", "objectNameChanged", "destroyed", "parentChanged",
    "thread", "signals", "children", "parent", "objectName",
  ]);

  for (const key of Object.getOwnPropertyNames(instance)) {
    if (visited.has(key)) continue;
    if (skipKeys.has(key)) continue;
    if (key.startsWith("_")) continue;
    if (typeof instance[key] === "function") continue;
    if (key === "constructor") continue;

    const value = instance[key];
    if (value === null || value === undefined) continue;

    const QP = getQPropertyClass();
    if (QP && value instanceof QP) continue;

    const typeName = value?.constructor?.name || "unknown";
    if (typeName === "Object" || typeName === "Array") continue;
    if (typeName === "Signal") continue;
    if (typeName === "String" || typeName === "Number" || typeName === "Boolean") continue;

    injections.push({ name: key, token: typeName });
  }

  return injections;
}

function getQPropertyClass(): any {
  try {
    return _require("@mocha/core")?.QProperty;
  } catch {
    return null;
  }
}

function detectMethods(instance: any, className: string): string[] {
  const methods: string[] = [];
  const builtins = new Set([
    "constructor", "toString", "valueOf", "toLocaleString",
    "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable",
    "__defineGetter__", "__defineSetter__", "__lookupGetter__", "__lookupSetter__",
    "init", "destroy", "connectedCallback", "disconnectedCallback",
    "bridgeCall", "routeLeave", "routeEnter", "routeUpdate",
    "destroyed", "objectNameChanged", "objectId",
    "findChild", "findChildren", "childAt",
    "connect", "blockSignals", "signalsBlocked",
    "deleteLater", "dumpObjectTree",
    "dispose", "addDisposable", "removeDisposable",
    "parentChanged", "emit", "on", "once", "off", "listeners",
  ]);

  let proto = Object.getPrototypeOf(instance);
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (builtins.has(key)) continue;
      if (key.startsWith("__qproperty_") || key.startsWith("__qcomputed_")) continue;
      if (key.startsWith("_")) continue;

      const descriptor = Object.getOwnPropertyDescriptor(proto, key);
      if (descriptor && typeof descriptor.value === "function") {
        methods.push(key);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  return methods;
}

function scanMethodsFromProto(target: any): string[] {
  const methods: string[] = [];
  const builtins = new Set(["constructor"]);

  let proto = target.prototype;
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (builtins.has(key)) continue;
      if (key.startsWith("__qproperty_") || key.startsWith("__qcomputed_")) continue;
      if (typeof proto[key] === "function") {
        methods.push(key);
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  return methods;
}

function detectViewChildren(instance: any): string[] {
  const children: string[] = [];
  for (const key of Object.getOwnPropertyNames(instance)) {
    const val = instance[key];
    if (val && val.__viewChild) {
      children.push(key);
    }
  }
  return children;
}

function extractImports(qml: string): string[] {
  const imports: string[] = [];
  const regex = /^[ \t]*import\s+(.+?)(?:\s*;)?\s*$/gm;
  let match;
  while ((match = regex.exec(qml)) !== null) {
    imports.push(match[1].trim());
  }
  return imports;
}
