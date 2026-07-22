import { parseController } from "./parse-controller.js";
import type { ControllerMeta } from "./parse-controller.js";
import { generateAngularTemplate, getAngularComponentImports, pathToComponentName } from "./gen-template.js";
import { generateAngularRoutes, generateRoutesFile } from "./gen-routes.js";
import type { RouteComponentFile } from "./gen-routes.js";
import { QMLTemplateParser } from "../qml-parser.js";
import { mapAllTokens } from "./map-design-tokens.js";

export interface GeneratedAngularFiles {
  serviceTs?: string;
  serviceName?: string;
  componentTs: string;
  componentHtml: string;
  componentName: string;
  routesTs?: string;
  routes: { path: string; componentName: string }[];
  routeFiles: RouteComponentFile[];
}

export function generateAngularComponent(target: any): GeneratedAngularFiles {
  const meta: ControllerMeta = parseController(target);

  const parser = new QMLTemplateParser();
  const document = parser.parse(meta.qmlTemplate);

  const options = {
    controllerName: "ctrl",
    useComponents: true,
  };

  const { template, imports: usedImports, routes: routeInfos } = generateAngularTemplate(document, options);

  const usedImportsSet: Set<string> = new Set(usedImports);
  const componentImports = getAngularComponentImports(usedImportsSet);
  const moduleImports = [...new Set([
    "Component",
    "inject",
    ...componentImports,
  ])];

  const importBlock = `import { ${moduleImports.join(", ")} } from "@angular/core";`;
  const mochaImport = `import { ${meta.className} as _OriginalClass } from "./${meta.className.toLowerCase()}.original";`;

  const serviceName = meta.className + "Service";
  const serviceFileName = toKebabCase(meta.className) + ".service";

  const serviceTs = generateServiceFile(meta, serviceName);

  const { routes, routeFiles } = generateAngularRoutes(routeInfos, serviceName, usedImportsSet);

  const routesTs = routes.length > 0 ? generateRoutesFile(routes) : undefined;

  const componentTs = `import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
})
export class AppComponent {}
`;

  const rawHtml = mapAllTokens(template);

  return {
    serviceTs,
    serviceName,
    componentTs,
    componentHtml: rawHtml,
    componentName: "AppComponent",
    routesTs,
    routes,
    routeFiles,
  };
}

function generateServiceFile(meta: ControllerMeta, serviceName: string): string {
  const imports: string[] = ["Injectable", "signal"];

  if (meta.injections.length > 0) {
    imports.push("inject");
  }

  const accessModifiers = new Set<string>();

  if (meta.qproperties.some(p => p.isComputed)) {
    imports.push("computed");
  }

  const lines: string[] = [];

  lines.push(`import { ${imports.join(", ")} } from "@angular/core";`);

  const injectedImports: string[] = [];
  for (const inj of meta.injections) {
    const tokenName = inj.token;
    const serviceFilePath = `./${toKebabCase(tokenName)}.service`;
    injectedImports.push(`import { ${tokenName}Service } from "${serviceFilePath}";`);
  }
  if (injectedImports.length > 0) {
    lines.push(injectedImports.join("\n"));
  }

  lines.push("");
  lines.push("@Injectable({ providedIn: \"root\" })");
  lines.push(`export class ${serviceName} {`);

  for (const qp of meta.qproperties) {
    if (qp.isComputed) {
      lines.push(`  readonly ${qp.name} = computed(() => "");`);
    } else {
      const init = formatInitialValue(qp.initialValue);
      lines.push(`  readonly ${qp.name} = signal(${init});`);
    }
    accessModifiers.add(qp.name);
  }

  for (const inj of meta.injections) {
    lines.push(`  readonly ${inj.name} = inject(${inj.token}Service);`);
    accessModifiers.add(inj.name);
  }

  for (const method of meta.methods) {
    if (accessModifiers.has(method)) continue;
    if (method.startsWith("on") || method === "bridgeCall") continue;
    if (method === "routeLeave" || method === "routeEnter" || method === "routeUpdate") continue;

    if (meta.autoBind) {
      lines.push(`  ${method}() {`);
      lines.push(`    // TODO: migrate from QML bridgeCall`);
      lines.push(`    console.log("[${serviceName}] ${method} called");`);
      lines.push(`  }`);
    } else {
      lines.push(`  ${method}() {`);
      lines.push(`    // TODO: implement ${method}`);
      lines.push(`  }`);
    }
  }

  lines.push("}");

  return lines.join("\n");
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function formatInitialValue(value: unknown): string {
  if (value === undefined || value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}
