import type { ParsedQMLDocument, ParsedQMLNode } from "../qml-parser.js";
import { mapDesignToken } from "./map-design-tokens.js";

export interface TemplateGenOptions {
  controllerName: string;
  useComponents: boolean;
  injectionMap?: Record<string, string>;
}

type AngularOutput = {
  template: string;
  imports: string[];
  routes: RouteInfo[];
};

type RouteInfo = {
  path: string;
  componentName: string;
  viewQml: string;
  viewNode: ParsedQMLNode;
};

const COMPONENT_MAP: Record<string, { tag: string; isAngularComponent: boolean; attrInputs: Record<string, string> }> = {
  Window: { tag: "div", isAngularComponent: false, attrInputs: {} },
  ApplicationWindow: { tag: "div", isAngularComponent: false, attrInputs: {} },
  Item: { tag: "ng-container", isAngularComponent: false, attrInputs: {} },
  HStack: { tag: "div", isAngularComponent: false, attrInputs: { spacing: "gap" } },
  VStack: { tag: "div", isAngularComponent: false, attrInputs: { spacing: "gap" } },
  Grid: { tag: "grid", isAngularComponent: true, attrInputs: {} },
  GridCol: { tag: "grid-col", isAngularComponent: true, attrInputs: {} },
  Box: { tag: "div", isAngularComponent: false, attrInputs: {} },
  Text: { tag: "span", isAngularComponent: false, attrInputs: {} },
  TextField: { tag: "input", isAngularComponent: true, attrInputs: {} },
  TextArea: { tag: "textarea", isAngularComponent: true, attrInputs: {} },
  Button: { tag: "button", isAngularComponent: true, attrInputs: { color: "color", size: "size" } },
  Checkbox: { tag: "checkbox", isAngularComponent: true, attrInputs: {} },
  Switch: { tag: "switch", isAngularComponent: true, attrInputs: {} },
  Slider: { tag: "slider", isAngularComponent: true, attrInputs: {} },
  Select: { tag: "select", isAngularComponent: true, attrInputs: {} },
  Router: { tag: "router-outlet", isAngularComponent: false, attrInputs: {} },
  RouterLink: { tag: "a", isAngularComponent: false, attrInputs: { to: "[routerLink]" } },
  Card: { tag: "card", isAngularComponent: true, attrInputs: {} },
  Badge: { tag: "badge", isAngularComponent: true, attrInputs: {} },
  Modal: { tag: "modal", isAngularComponent: true, attrInputs: {} },
  Drawer: { tag: "drawer", isAngularComponent: true, attrInputs: {} },
  Dropdown: { tag: "dropdown", isAngularComponent: true, attrInputs: {} },
  DropdownItem: { tag: "dropdown-item", isAngularComponent: true, attrInputs: {} },
  Icon: { tag: "icon", isAngularComponent: true, attrInputs: {} },
  Avatar: { tag: "avatar", isAngularComponent: true, attrInputs: {} },
  Alert: { tag: "alert", isAngularComponent: true, attrInputs: {} },
  ProgressBar: { tag: "progressbar", isAngularComponent: true, attrInputs: {} },
  Table: { tag: "table", isAngularComponent: true, attrInputs: {} },
  Tabs: { tag: "tabs", isAngularComponent: true, attrInputs: {} },
  Tab: { tag: "tabs-content", isAngularComponent: true, attrInputs: {} },
  Stepper: { tag: "stepper", isAngularComponent: true, attrInputs: {} },
  Steps: { tag: "steps", isAngularComponent: true, attrInputs: {} },
  Tooltip: { tag: "span", isAngularComponent: true, attrInputs: {} },
  HoverCard: { tag: "hover-card", isAngularComponent: true, attrInputs: {} },
  ScrollArea: { tag: "scroll-area", isAngularComponent: true, attrInputs: {} },
  Breadcrumb: { tag: "breadcrumb", isAngularComponent: true, attrInputs: {} },
  Pagination: { tag: "pagination", isAngularComponent: true, attrInputs: {} },
  Skeleton: { tag: "skeleton", isAngularComponent: true, attrInputs: {} },
  Animate: { tag: "animate", isAngularComponent: true, attrInputs: {} },
  ColorPicker: { tag: "color-picker", isAngularComponent: true, attrInputs: {} },
  Sidebar: { tag: "sidebar", isAngularComponent: true, attrInputs: {} },
  Shell: { tag: "shell", isAngularComponent: true, attrInputs: {} },
  Tile: { tag: "tile", isAngularComponent: true, attrInputs: {} },
  Carousel: { tag: "carousel", isAngularComponent: true, attrInputs: {} },
  Command: { tag: "command", isAngularComponent: true, attrInputs: {} },
  DatePicker: { tag: "date-picker", isAngularComponent: true, attrInputs: {} },
  Kanban: { tag: "kanban", isAngularComponent: true, attrInputs: {} },
  TreeTable: { tag: "tree-table", isAngularComponent: true, attrInputs: {} },
};

const QML_EVENT_MAP: Record<string, string> = {
  onClicked: "click",
  onDoubleClicked: "dblclick",
  onPressed: "mousedown",
  onReleased: "mouseup",
  onEnter: "keydown.enter",
  onReturnPressed: "keydown.enter",
  onTextEdited: "input",
  onTextChanged: "input",
  onCheckedChanged: "change",
  onValueChanged: "change",
  onCurrentIndexChanged: "change",
  onAccepted: "keydown.enter",
  onFocusChanged: "blur",
  onActiveFocusChanged: "focus",
};

const ANGULAR_COMPONENT_IMPORTS: Record<string, string> = {
  grid: "GridComponent, GridColComponent",
  "grid-col": "",
  input: "InputComponent",
  textarea: "TextAreaComponent",
  button: "ButtonComponent",
  checkbox: "CheckboxComponent",
  switch: "SwitchComponent",
  slider: "SliderComponent",
  select: "SelectComponent",
  card: "CardComponent",
  badge: "BadgeComponent",
  modal: "ModalComponent",
  drawer: "DrawerComponent",
  dropdown: "DropdownComponent, DropdownItemComponent",
  "dropdown-item": "",
  icon: "IconComponent",
  avatar: "AvatarComponent",
  alert: "AlertComponent",
  progressbar: "ProgressBarComponent",
  table: "TableComponent",
  tabs: "TabsComponent, TabsListComponent, TabsTriggerComponent, TabsContentComponent",
  "tabs-content": "",
  stepper: "StepperComponent",
  steps: "StepsComponent",
  tooltip: "TooltipDirective",
  "hover-card": "HoverCardComponent",
  "scroll-area": "ScrollAreaComponent",
  breadcrumb: "BreadcrumbComponent",
  pagination: "PaginationComponent",
  skeleton: "SkeletonComponent",
  animate: "AnimateComponent",
  "color-picker": "ColorPickerComponent",
  sidebar: "SidebarComponent",
  shell: "ShellComponent",
  tile: "TileComponent",
  carousel: "CarouselComponent",
  command: "CommandComponent",
  "date-picker": "DatePickerComponent",
  kanban: "KanbanComponent",
  "tree-table": "TreeTableComponent",
};

export function generateAngularTemplate(
  document: ParsedQMLDocument,
  options: TemplateGenOptions
): AngularOutput {
  const routes: RouteInfo[] = [];
  const collectedImports = new Set<string>();

  const template = nodeToHtml(document.root, options, "", routes, collectedImports);

  const imports = [...collectedImports];

  return { template, imports, routes };
}

function nodeToHtml(
  node: ParsedQMLNode,
  options: TemplateGenOptions,
  indent: string,
  routes: RouteInfo[],
  collectedImports: Set<string>
): string {
  if (node.type === "Route") {
    return generateRoute(node, options, indent, routes, collectedImports);
  }

  if (node.type === "Repeater") {
    return generateRepeater(node, options, indent, collectedImports);
  }

  if (node.type === "Component") {
    return node.children
      .map(c => nodeToHtml(c, options, indent, routes, collectedImports))
      .join("\n");
  }

  const mapping = COMPONENT_MAP[node.type];
  if (!mapping) {
    const children = node.children
      .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
      .join("\n");
    if (children) return children;
    return "";
  }

  if (mapping.isAngularComponent) {
    collectedImports.add(mapping.tag);
  }

  const isSelfClosing = mapping.tag === "router-outlet" || mapping.tag === "input";

  const ownClasses = computeClasses(node);
  const ownAttrs = computeAttributes(node, options, mapping);

  if (node.type === "Text") {
    const text = node.properties.text;
    let textClass = ownClasses || "text-base";
    if (node.properties.font && typeof node.properties.font === "object") {
      const font = node.properties.font as Record<string, unknown>;
      if (font.pixelSize) {
        const size = String(font.pixelSize);
        const sizeMap: Record<string, string> = {
          "10": "text-xs", "12": "text-sm", "14": "text-base",
          "16": "text-lg", "18": "text-xl", "20": "text-2xl",
          "24": "text-3xl", "30": "text-4xl", "36": "text-5xl",
        };
        textClass = sizeMap[size] || textClass;
      }
      if (font.bold) textClass += " font-bold";
    }
    if (typeof text === "string") {
      if (isDynamicExpression(text)) {
        const expr = translateBinding(text, options);
        return `${indent}<span class="${textClass}">{{ ${expr} }}</span>`;
      }
      return `${indent}<span class="${textClass}">${escapeHtml(text)}</span>`;
    }
    if (text && typeof text === "object" && text.type === "binding") {
      const expr = translateBinding(text.expression, options);
      return `${indent}<span class="${textClass}">{{ ${expr} }}</span>`;
    }
  }

  if (node.type === "RouterLink") {
    const to = node.properties.to ?? node.properties.path ?? "/";
    const text = node.properties.text ?? "";
    const icon = node.properties.icon;
    const routerLink = typeof to === "string" ? `['${to}']` : to;
    let inner = "";
    if (icon) {
      inner = `<icon name="${icon}" size="md"></icon> `;
      collectedImports.add("icon");
    }
    inner += escapeHtml(String(text));
    return `${indent}<a [routerLink]="${routerLink}" class="${ownClasses}">${inner}</a>`;
  }

  if (node.type === "Router") {
    routes.length = 0;
    for (const child of node.children) {
      if (child.type === "Route") {
        nodeToHtml(child, options, indent, routes, collectedImports);
      }
    }
    let childContent = node.children
      .filter(c => c.type !== "Route")
      .map(c => nodeToHtml(c, options, indent, routes, collectedImports))
      .join("\n");
    if (childContent) {
      return childContent;
    }
    return `${indent}<router-outlet></router-outlet>`;
  }

  if (node.type === "HStack" || node.type === "VStack") {
    const direction = node.type === "HStack" ? "row" : "col";
    let classStr = `d-flex flex-${direction} gap-3`;
    const alignment = node.properties.alignItems;
    if (alignment) {
      const alignMap: Record<string, string> = { center: "align-center", start: "align-start", end: "align-end" };
      if (alignMap[alignment as string]) classStr += " " + alignMap[alignment as string];
    }
    if (ownClasses) classStr += " " + ownClasses;
    const spacing = node.properties.spacing;
    if (spacing) {
      const mapped = mapDesignToken(String(spacing));
      if (mapped) classStr = classStr.replace(/gap-3/, `gap-${mapped}`);
    }
    const children = node.children
      .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
      .join("\n");
    return `${indent}<div class="${classStr}">\n${children}\n${indent}</div>`;
  }

  if (node.type === "Grid") {
    const gap = node.properties.gap ?? node.properties.spacing;
    let gapNum = "3";
    if (gap) {
      const mapped = mapDesignToken(String(gap));
      if (mapped) gapNum = mapped;
    }
    const children = node.children
      .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
      .join("\n");
    return `${indent}<grid [gap]="${gapNum}" class="${ownClasses}">\n${children}\n${indent}</grid>`;
  }

  if (node.type === "GridCol") {
    const span = node.properties.span;
    const children = node.children
      .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
      .join("\n");
    if (span) {
      return `${indent}<grid-col [span]="${span}" class="${ownClasses}">\n${children}\n${indent}</grid-col>`;
    }
    return `${indent}<grid-col class="${ownClasses}">\n${children}\n${indent}</grid-col>`;
  }

  if (node.type === "Box") {
    let classStr = ownClasses || "";
    const padding = node.properties.padding;
    if (padding) {
      const mapped = mapDesignToken(String(padding));
      if (mapped) classStr += ` p-${mapped}`;
    }
    const margin = node.properties.margin;
    if (margin) {
      const mapped = mapDesignToken(String(margin));
      if (mapped) classStr += ` m-${mapped}`;
    }
    const children = node.children
      .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
      .join("\n");
    return `${indent}<div class="${classStr}">\n${children}\n${indent}</div>`;
  }

  if (node.type === "Window" || node.type === "ApplicationWindow") {
    let classStr = "shell w-full min-h-screen bg-base";
    if (ownClasses) classStr += " " + ownClasses;
    const children = node.children
      .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
      .join("\n");
    return `${indent}<div class="${classStr}">\n${children}\n${indent}</div>`;
  }

  if (node.type === "Icon") {
    const name = node.properties.name ?? node.properties.icon ?? "info";
    const size = node.properties.size ?? "md";
    collectedImports.add("icon");
    return `${indent}<icon name="${name}" size="${size}"></icon>`;
  }

  if (isSelfClosing) {
    return `${indent}<${mapping.tag} ${ownAttrs} class="${ownClasses}" />`;
  }

  const children = node.children
    .map(c => nodeToHtml(c, options, indent + "  ", routes, collectedImports))
    .join("\n");

  if (children) {
    return `${indent}<${mapping.tag} ${ownAttrs} class="${ownClasses}">\n${children}\n${indent}</${mapping.tag}>`;
  }
  return `${indent}<${mapping.tag} ${ownAttrs} class="${ownClasses}"></${mapping.tag}>`;
}

function generateRoute(
  node: ParsedQMLNode,
  options: TemplateGenOptions,
  indent: string,
  routes: RouteInfo[],
  collectedImports: Set<string>
): string {
  const path = node.properties.path as string || "/";
  const viewNode = node.children.find(c => c.type === "Component");
  if (!viewNode) return "";

  const componentName = pathToComponentName(path);
  const inner = viewNode.children
    .map(c => nodeToHtml(c, options, "", routes, collectedImports))
    .join("\n");

  routes.push({
    path,
    componentName,
    viewQml: inner,
    viewNode,
  });

  return "";
}

function generateRepeater(
  node: ParsedQMLNode,
  options: TemplateGenOptions,
  indent: string,
  collectedImports: Set<string>
): string {
  const model = node.properties.model;
  const delegate = node.children.find(c => c.type === "Text") ?? node.children[0];
  if (!model) return "";

  let modelExpr = "items";
  if (typeof model === "object" && model.type === "binding") {
    modelExpr = translateBinding(model.expression, options);
  } else if (typeof model === "string") {
    modelExpr = translateBinding(model, options);
  }

  let delegateHtml = "";
  if (delegate) {
    delegateHtml = nodeToHtml(delegate, options, indent + "  ", [], collectedImports);
    delegateHtml = delegateHtml.replace(/text="">(.*?)<\/span>/, "text=\"\">{{ item }}\"></span>");
  }

  return `${indent}@for (item of ${modelExpr}; track $index) {\n${indent}  ${delegateHtml.trim()}\n${indent}}`;
}

function computeClasses(node: ParsedQMLNode): string {
  const classes: string[] = [];

  if (node.type === "Window" || node.type === "ApplicationWindow") {
    return "shell w-full min-h-screen bg-base";
  }

  const color = node.properties.color;
  if (color && typeof color === "string") {
    const mapped = mapDesignToken(color);
    if (mapped) {
      return mapped;
    }
  }

  const variant = node.properties.variant;
  if (variant && typeof variant === "string") {
    classes.push(`variant-${variant}`);
  }

  return classes.join(" ");
}

function computeAttributes(
  node: ParsedQMLNode,
  options: TemplateGenOptions,
  mapping: { tag: string; isAngularComponent: boolean; attrInputs: Record<string, string> }
): string {
  const attrs: string[] = [];

  if (node.type === "Button") {
    const color = node.properties.color ?? "mauve";
    const size = node.properties.size ?? "md";
    const rawVariant = node.properties.variant ?? "filled";
    const variant = String(rawVariant) === "secondary" ? "outline" : String(rawVariant);
    attrs.push(`variant="${escapeAttr(variant)}"`);
    attrs.push(`color="${escapeAttr(String(color))}"`);
    attrs.push(`size="${escapeAttr(String(size))}"`);
  }

  if (node.type === "TextField" || node.type === "TextArea") {
    const placeholder = node.properties.placeholder;
    if (placeholder && typeof placeholder === "string") {
      attrs.push(`placeholder="${escapeAttr(placeholder)}"`);
    }
    const id = node.id;
    if (id) {
      attrs.push(`#${id}`);
    }
    const textBinding = node.properties.text;
    if (textBinding && typeof textBinding === "object" && textBinding.type === "binding") {
      attrs.push(`[value]="${translateBinding(textBinding.expression, options)}"`);
    }
  }

  if (node.type === "Checkbox") {
    const label = node.properties.label ?? node.properties.text ?? "";
    if (label) attrs.push(`[label]="'${escapeAttr(String(label))}'"`);
  }

  if (node.type === "Switch") {
    const label = node.properties.label ?? node.properties.text ?? "";
    if (label) attrs.push(`[label]="'${escapeAttr(String(label))}'"`);
  }

  Object.entries(node.signalHandlers).forEach(([key, value]) => {
    const eventName = QML_EVENT_MAP[key] ?? key.replace(/^on/, "").toLowerCase();
    const method = translateHandler(value, options.controllerName, options.injectionMap ?? {}, key);
    const quote = method.includes('"') ? "'" : '"';
    attrs.push(`(${eventName})=${quote}${method}${quote}`);
  });

  if (node.id && node.type !== "TextField" && node.type !== "TextArea") {
    attrs.push(`#${node.id}`);
  }

  for (const [prop, value] of Object.entries(node.properties)) {
    if (prop === "color" || prop === "variant" || prop === "size" || prop === "placeholder") continue;
    if (prop === "text" && node.type !== "Text" && node.type !== "TextField" && node.type !== "TextArea") {
      if (typeof value === "string") {
        if (isDynamicExpression(value)) {
          attrs.push(`[text]="${translateBinding(value, options)}"`);
        } else {
          attrs.push(`text="${escapeAttr(value)}"`);
        }
      } else if (value && typeof value === "object" && value.type === "binding") {
        attrs.push(`[text]="${translateBinding(value.expression, options)}"`);
      }
      continue;
    }
    if (prop.startsWith("on")) continue;
    if (prop === "id" || prop === "objectName" || prop === "anchors" || prop === "visible") continue;
  }

  return attrs.join(" ");
}

function isDynamicExpression(text: string): boolean {
  return /controller\./.test(text) ||
    /\bmodelData\b/.test(text) ||
    /\$\{.*?\}/.test(text) ||
    /\.value\b/.test(text) ||
    /\w+\.get\(/.test(text) ||
    /"[^"]*"\s*\+\s*[a-zA-Z_]\w*/.test(text);
}

export function translateBinding(expr: string, options: TemplateGenOptions): string {
  let result = expr;

  const injections = options.injectionMap ?? {};

  result = result.replace(/(\w+)\.get\("(\w+)"\)/g, (_, svc, prop) => {
    const instanceName = injections[svc];
    if (instanceName) {
      return `${options.controllerName}.${instanceName}.${prop}()`;
    }
    const camelSvc = svc.charAt(0).toLowerCase() + svc.slice(1);
    return `${camelSvc}.${prop}()`;
  });

  result = result.replace(/\bmodelData\b/g, "item");

  result = result.replace(/controller\.(\w+)\.value\b/g, (_, prop) => {
    return `${options.controllerName}.${prop}()`;
  });

  result = result.replace(/controller\.(\w+)\b(?!\.(?:value|get)\b)/g, (_, prop) => {
    return `${options.controllerName}.${prop}()`;
  });

  result = result.replace(/\$\{controller\.(\w+)\}/g, (_, prop) => {
    return `\$\{${options.controllerName}.${prop}()\}`;
  });

  return result;
}

function translateHandler(value: string, controllerName: string, injectionMap: Record<string, string>, signalName?: string): string {
  if (value.includes("bridgeCall")) {
    const prefixedMatch = value.match(/^(\w+)\.bridgeCall\("(\w+)"\)/);
    if (prefixedMatch) {
      const prefix = prefixedMatch[1];
      if (prefix === "controller") {
        return `${controllerName}.${prefixedMatch[2]}()`;
      }
      const instanceName = injectionMap[prefix];
      if (instanceName) {
        return `${controllerName}.${instanceName}.${prefixedMatch[2]}()`;
      }
      const camelSvc = prefix.charAt(0).toLowerCase() + prefix.slice(1);
      return `${camelSvc}.${prefixedMatch[2]}()`;
    }
    const match = value.match(/bridgeCall\("(\w+)"\)/);
    if (match) {
      return `${controllerName}.${match[1]}()`;
    }
    const multiMatch = value.match(/bridgeCall\("(\w+)\|(.+?)"\)/);
    if (multiMatch) {
      return `${controllerName}.${multiMatch[1]}(${multiMatch[2]})`;
    }
  }

  let result = value;

  // Replace controller.* with ctrl.*
  if (value.includes("controller.")) {
    result = result.replace(/controller\./g, `${controllerName}.`);
  }

  // Replace QML implicit parameters with Angular equivalents based on signal name
  if (signalName === "onTextEdited" || signalName === "onTextChanged") {
    result = result.replace(/\(\s*text\s*\)/g, "($event.target.value)");
    result = result.replace(/([,\s])text\s*\)/g, "$1$event.target.value)");
    result = result.replace(/\(\s*text([,\s])/g, "($event.target.value$1");
    result = result.replace(/^text$/, "$event.target.value");
    result = result.replace(/([=+\-*\/%])\s*text\b/g, "$1$event.target.value");
    result = result.replace(/\btext\s*([=+\-*\/%])/g, "$event.target.value$1");
  }
  if (signalName === "onCheckedChanged") {
    result = result.replace(/\(\s*checked\s*\)/g, "($event)");
    result = result.replace(/([,\s])checked\s*\)/g, "$1$event)");
    result = result.replace(/\(\s*checked([,\s])/g, "($event$1");
    result = result.replace(/^checked$/, "$event");
    result = result.replace(/([=+\-*\/%])\s*checked\b/g, "$1$event");
    result = result.replace(/\bchecked\s*([=+\-*\/%])/g, "$event$1");
  }
  if (signalName === "onValueChanged") {
    result = result.replace(/\(\s*value\s*\)/g, "($event)");
    result = result.replace(/([,\s])value\s*\)/g, "$1$event)");
    result = result.replace(/\(\s*value([,\s])/g, "($event$1");
    result = result.replace(/^value$/, "$event");
    result = result.replace(/([=+\-*\/%])\s*value\b/g, "$1$event");
    result = result.replace(/\bvalue\s*([=+\-*\/%])/g, "$event$1");
  }

  return result;
}

export function pathToComponentName(path: string): string {
  const clean = path.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");
  if (!clean) return "HomeComponent";
  const parts = clean.split("-").filter(Boolean);
  const name = parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
  return name + "Component";
}

export function getAngularComponentImports(tags: Set<string>): string[] {
  const modules: string[] = [];
  const seen = new Set<string>();

  for (const tag of tags) {
    const importSpec = ANGULAR_COMPONENT_IMPORTS[tag];
    if (!importSpec) continue;
    const names = importSpec.split(",").map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      if (!seen.has(name)) {
        seen.add(name);
        modules.push(name);
      }
    }
  }

  return modules;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/@/g, "&#64;");
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
