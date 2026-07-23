import { getAllQMLComponents, generateAngularComponent } from "@mocha/qml";
import { pathToFileURL } from "node:url";
import * as fs from "node:fs";
import * as path from "node:path";

const outputDir = process.argv[2];
const entryPaths = process.argv.slice(3);

if (!outputDir || entryPaths.length === 0) {
  console.error("Usage: codegen-worker <outputDir> <entry1> [entry2...]");
  process.exit(1);
}

async function main() {
  for (const entry of entryPaths) {
    try {
      const url = pathToFileURL(path.resolve(entry));
      await import(url.href);
    } catch (e) {
      console.error(`[codegen] Failed to import: ${entry}`, (e as Error).message);
    }
  }

  let isFirst = true;
  for (const [ctor, meta] of getAllQMLComponents().entries()) {
    if (meta.platform !== "web") continue;
    const files = generateAngularComponent(ctor);

    if (files.serviceTs) {
      const svcDir = path.join(outputDir, "src", "app");
      fs.mkdirSync(svcDir, { recursive: true });
      fs.writeFileSync(path.join(svcDir, toKebab(meta.componentName) + ".service.ts"), files.serviceTs);
    }

    if (isFirst) {
      isFirst = false;
      const appDir = path.join(outputDir, "src", "app");
      fs.mkdirSync(appDir, { recursive: true });
      fs.writeFileSync(path.join(appDir, "app.component.ts"), files.componentTs);
      fs.writeFileSync(path.join(appDir, "app.component.html"), files.componentHtml);
      if (files.routesTs) fs.writeFileSync(path.join(appDir, "app.routes.ts"), files.routesTs);
    }

    for (const rf of files.routeFiles) {
      const routeDir = path.join(outputDir, "src", "app");
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, rf.fileName + ".ts"), rf.tsContent);
      fs.writeFileSync(path.join(routeDir, rf.fileName + ".html"), rf.htmlContent);
    }
  }
}

main().catch((err) => {
  console.error("[codegen] Fatal error:", err);
  process.exit(1);
});

function toKebab(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
