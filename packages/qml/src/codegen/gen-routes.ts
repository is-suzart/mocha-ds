import type { ParsedQMLNode } from "../qml-parser.js";
import { getAngularComponentImports } from "./gen-template.js";

export interface RouteDefinition {
  path: string;
  componentName: string;
  componentClass: string;
  importPath: string;
}

export interface RouteComponentFile {
  componentName: string;
  fileName: string;
  tsContent: string;
  htmlContent: string;
  imports: string[];
}

export function generateAngularRoutes(
  routeInfos: { path: string; componentName: string; viewQml: string }[],
  controllerServiceName: string,
  collectedImports: Set<string>
): { routes: RouteDefinition[]; routeFiles: RouteComponentFile[] } {
  const routes: RouteDefinition[] = [];
  const routeFiles: RouteComponentFile[] = [];

  for (const info of routeInfos) {
    const fileName = `${info.componentName.charAt(0).toLowerCase() + info.componentName.slice(1)}`;

    const routeImports = getAngularComponentImports(collectedImports);

    const mochaImportLine = routeImports.length > 0
      ? `import { ${routeImports.join(", ")} } from "./mocha-ds/index";`
      : "";

    const importStatements = [
      `import { Component, inject } from "@angular/core";`,
      `import { RouterModule } from "@angular/router";`,
      mochaImportLine,
      `import { ${controllerServiceName} } from "./${controllerServiceToFileName(controllerServiceName)}";`,
    ].filter(Boolean).join("\n");

    const allImports = ["RouterModule", ...routeImports];

    const tsContent = `${importStatements}

@Component({
  selector: "app-${toKebabCase(info.componentName)}",
  standalone: true,
  imports: [${allImports.join(", ")}],
  templateUrl: "./${fileName}.component.html",
})
export class ${info.componentName} {
  ctrl = inject(${controllerServiceName});
}
`;

    const htmlContent = info.viewQml;

    routeFiles.push({
      componentName: info.componentName,
      fileName: `${fileName}.component`,
      tsContent,
      htmlContent,
      imports: [],
    });

    routes.push({
      path: info.path.replace(/^\//, ""),
      componentName: info.componentName,
      componentClass: info.componentName,
      importPath: `./${fileName}.component`,
    });
  }

  return { routes, routeFiles };
}

export function generateRoutesFile(
  routes: RouteDefinition[]
): string {
  const imports = routes
    .map(r => `import { ${r.componentClass} } from "${r.importPath}";`)
    .join("\n");

  const routeEntries = routes
    .map(r => `  { path: "${r.path}", component: ${r.componentClass} },`)
    .join("\n");

  const fallback = routes.length > 0
    ? `  { path: "", redirectTo: "${routes[0].path}", pathMatch: "full" },`
    : "";

  return `${imports}
import { Routes } from "@angular/router";

export const routes: Routes = [
${routeEntries}
${fallback}
];`;
}

function buildComponentImportStatements(moduleNames: string[]): string {
  if (moduleNames.length === 0) return "RouterModule";
  return ["RouterModule", ...moduleNames].join(", ");
}

function controllerServiceToFileName(name: string): string {
  const base = name.replace(/Service$/, "");
  return toKebabCase(base) + ".service";
}

function toKebabCase(str: string): string {
  return str
    .replace(/Component$/, ".component")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/\.component$/, ".component");
}
