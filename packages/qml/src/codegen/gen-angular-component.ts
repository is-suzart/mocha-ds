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

  const injectionMap: Record<string, string> = {};
  for (const inj of meta.injections) {
    injectionMap[inj.token] = inj.name;
  }

  const options = {
    controllerName: "ctrl",
    useComponents: true,
    injectionMap,
  };

  const { template, imports: usedImports, routes: routeInfos } = generateAngularTemplate(document, options);

  const usedImportsSet: Set<string> = new Set(usedImports);
  const componentImports = getAngularComponentImports(usedImportsSet);

  const serviceName = meta.className + "Service";
  const serviceFileName = toKebabCase(meta.className) + ".service";
  const hasRouter = routeInfos.length > 0;

  const serviceTs = generateServiceFile(meta, serviceName);

  const { routes, routeFiles } = generateAngularRoutes(routeInfos, serviceName, usedImportsSet);

  const routesTs = routes.length > 0 ? generateRoutesFile(routes) : undefined;

  const coreImports = ["Component", "inject"];
  const mochaDsImport = componentImports.length > 0
    ? `import { ${componentImports.join(", ")} } from "./mocha-ds/index";`
    : "";

  const componentTs = `import { ${coreImports.join(", ")} } from "@angular/core";
${hasRouter ? `import { RouterOutlet } from "@angular/router";` : ""}
${mochaDsImport}
import { ${serviceName} } from "./${serviceFileName}";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [${hasRouter ? "RouterOutlet, " : ""}${componentImports.join(", ")}],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  ctrl = inject(${serviceName});
}
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

    const raw = meta.methodBodies[method];
    if (raw) {
      let params = "";
      let body = raw;
      const paramsMatch = raw.match(/^__params\((.+)\)__(.*)$/s);
      if (paramsMatch) {
        params = paramsMatch[1].replace(/(\w+)(\s*[,)]|$)/g, (m, p) => `${p}: any`);
        body = paramsMatch[2];
      }
      const translated = translateMethodBody(body);
      const thisRefs = translated.match(/this\.(\w+)\b/g) || [];
      const unknownRefs = thisRefs
        .map(r => r.replace("this.", ""))
        .filter(r => !accessModifiers.has(r) && !["console"].includes(r));
      const qmlKeywords = ["switchTheme", "santanderLight", "santanderDark", "bridgeCall",
        "__mochaNative", "__name", "runApp"];
      const hasQmlRefs = qmlKeywords.some(k => translated.includes(k));
      if (unknownRefs.length > 0 || hasQmlRefs) {
        lines.push(`  ${method}(${params}) {`);
        const hints: string[] = [];
        if (unknownRefs.length > 0) hints.push(`references: ${unknownRefs.join(", ")}`);
        if (hasQmlRefs) hints.push(`QML-specific symbols`);
        lines.push(`    // TODO: adapt from QML — ${hints.join("; ")}`);
        for (const line of translated.split("\n")) {
          lines.push(`    // ${line}`);
        }
        lines.push(`  }`);
      } else {
        lines.push(`  ${method}(${params}) {`);
        for (const line of translated.split("\n")) {
          lines.push(`    ${line}`);
        }
        lines.push(`  }`);
      }
    } else {
      lines.push(`  ${method}() {`);
      lines.push(`    // TODO: implement ${method}`);
      lines.push(`  }`);
    }
  }

  lines.push("}");

  return lines.join("\n");
}

function translateMethodBody(body: string): string {
  let result = body;
  result = result.replace(/this\.(\w+)\.set\((.+?)\)(\s*[;}]|$)/g, (_, prop, expr, end) => {
    return `this.${prop}.set(${expr})${end}`;
  });
  result = result.replace(/this\.(\w+)\.value\s*\+=(.+?)(\s*[;}]|$)/g, (_, prop, expr, end) => {
    return `this.${prop}.update(v => v + ${expr.trim()})${end}`;
  });
  result = result.replace(/this\.(\w+)\.value\s*=(?!=)(.+?)(\s*[;}]|$)/g, (_, prop, expr, end) => {
    return `this.${prop}.set(${expr.trim()})${end}`;
  });
  result = result.replace(/this\.(\w+)\.value\b(?!\s*=)/g, (_, prop) => `this.${prop}()`);
  return result;
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
