import { Logger } from "@mocha/shared";
import { getAllQMLComponents, generateAngularComponent, clearQMLComponents } from "@mocha/qml";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger("web-codegen");

export async function generateAllAngularFiles(
  sourceDir: string,
  outputDir: string,
  projectDir: string,
  entryPath?: string,
): Promise<void> {
  let qmlFiles = findQmlTsFiles(sourceDir);
  if (qmlFiles.length === 0) {
    if (entryPath && fs.existsSync(entryPath)) {
      logger.info("No .qml.ts files found — using entry file:", path.relative(projectDir, entryPath));
      qmlFiles = [entryPath];
    } else {
      logger.warn("No .qml.ts files found in", sourceDir);
      return;
    }
  }
  await runCodegenInline(qmlFiles, outputDir, projectDir);
}

async function runCodegenInline(
  qmlFiles: string[],
  outputDir: string,
  projectDir: string,
): Promise<void> {
  clearQMLComponents();

  let unregisterTsx: (() => void) | undefined;
  try {
    const { register } = await import("tsx/esm/api");
    unregisterTsx = register();
  } catch {
    // tsx loader not available; assume .ts is handled natively
  }

  const appDir = path.join(outputDir, "src", "app");
  fs.mkdirSync(appDir, { recursive: true });

  for (const entry of qmlFiles) {
    try {
      const absPath = path.resolve(projectDir, entry);
      const url = pathToFileURL(absPath);
      await import(url.href);
    } catch (e) {
      logger.error(`Failed to import: ${entry}`, (e as Error).message);
    }
  }

  if (unregisterTsx) unregisterTsx();

  const webComponents = [...getAllQMLComponents().entries()].filter(([, m]) => m.platform === "web");
  const generated = webComponents.map(([ctor]) => ({ ctor, files: generateAngularComponent(ctor) }));

  const mainIdx = generated.findIndex(g => g.files.routes && g.files.routes.length > 0);
  const main = mainIdx >= 0 ? generated.splice(mainIdx, 1)[0] : generated.shift();

  for (const { files } of generated) {
    if (files.serviceTs) {
      const baseName = (files.serviceName ?? "Service").replace(/Service$/, "");
      fs.writeFileSync(path.join(appDir, toKebab(baseName) + ".service.ts"), files.serviceTs);
    }
    for (const rf of files.routeFiles) {
      fs.writeFileSync(path.join(appDir, rf.fileName + ".ts"), rf.tsContent);
      fs.writeFileSync(path.join(appDir, rf.fileName + ".html"), rf.htmlContent);
    }
  }

  if (main) {
    if (main.files.serviceTs) {
      const baseName = (main.files.serviceName ?? "Service").replace(/Service$/, "");
      fs.writeFileSync(path.join(appDir, toKebab(baseName) + ".service.ts"), main.files.serviceTs);
    }
    fs.writeFileSync(path.join(appDir, "app.component.ts"), main.files.componentTs);
    fs.writeFileSync(path.join(appDir, "app.component.html"), main.files.componentHtml);
    if (main.files.routesTs) fs.writeFileSync(path.join(appDir, "app.routes.ts"), main.files.routesTs);
    for (const rf of main.files.routeFiles) {
      fs.writeFileSync(path.join(appDir, rf.fileName + ".ts"), rf.tsContent);
      fs.writeFileSync(path.join(appDir, rf.fileName + ".html"), rf.htmlContent);
    }
  }
}

function toKebab(s: string): string {
  return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

export function startWebFileWatcher(
  srcDir: string,
  outputDir: string,
  projectDir: string,
  onChange?: (filename: string) => void,
  entryPath?: string,
): { close: () => void } {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let watcher: fs.FSWatcher | null = null;
  let closed = false;

  const handleChange = (filename: string | null) => {
    if (!filename) return;
    const isQmlTs = filename.endsWith(".qml.ts");
    const isEntry = entryPath && filename === path.relative(srcDir, entryPath);
    if (!isQmlTs && !isEntry) return;
    if (closed) return;

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      logger.info(`[web-hmr] File changed: ${filename}`);
      try {
        let files = findQmlTsFiles(srcDir);
        if (files.length === 0 && entryPath && fs.existsSync(entryPath)) {
          files = [entryPath];
        }
        if (files.length > 0) {
          await runCodegenInline(files, outputDir, projectDir);
          logger.info(`[web-hmr] Angular files regenerated (${files.length} files processed)`);
          onChange?.(filename);
        }
      } catch (err) {
        logger.error(`[web-hmr] Codegen failed for ${filename}:`, err);
      }
    }, 150);
  };

  try {
    watcher = fs.watch(srcDir, { recursive: true }, (event, filename) => {
      handleChange(filename);
    });
    watcher.on("error", (err) => {
      logger.warn(`[web-hmr] fs.watch error: ${(err as any)?.message ?? err}`);
    });
    logger.info(`[web-hmr] Watching ${srcDir} for .qml.ts changes`);
  } catch (err) {
    logger.warn(`[web-hmr] fs.watch failed: ${(err as any)?.message ?? err}`);
  }

  return {
    close: () => {
      closed = true;
      if (watcher) {
        try {
          watcher.close();
        } catch {}
      }
      if (debounceTimer) clearTimeout(debounceTimer);
    },
  };
}

export function copyAngularTemplate(templateDir: string, outputDir: string): void {
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Angular template not found at: ${templateDir}`);
  }
  copyDirSync(templateDir, outputDir);
}

export function applyPlaceholders(dir: string, placeholders: Record<string, string>): void {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && !entry.name.startsWith(".")) {
      applyPlaceholders(p, placeholders);
    } else if (entry.isFile()) {
      try {
        let content = fs.readFileSync(p, "utf-8");
        let modified = false;
        for (const [key, val] of Object.entries(placeholders)) {
          if (content.includes(key)) {
            content = content.split(key).join(val);
            modified = true;
          }
        }
        if (modified) fs.writeFileSync(p, content);
      } catch {}
    }
  }
}

export function copyThemeCss(outputDir: string, monorepoRoot: string | null): void {
  if (!monorepoRoot) return;
  try {
    const cssFile = path.join(monorepoRoot, "packages", "css", "dist", "catppuccin.css");
    if (fs.existsSync(cssFile)) {
      const themeDir = path.join(outputDir, "src", "app");
      fs.mkdirSync(themeDir, { recursive: true });
      fs.copyFileSync(cssFile, path.join(themeDir, "theme.css"));
    }
  } catch {}
}

export function linkLocalPackages(outputDir: string, monorepoRoot: string | null): void {
  if (!monorepoRoot) return;
  const pkgPath = path.join(outputDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;
  try {
    // Copy @mocha-ds/angular source .ts files into src/app/mocha-ds so Angular compiler can process them
    const angularSrc = path.join(monorepoRoot, "packages", "angular");
    const angularDest = path.join(outputDir, "src", "app", "mocha-ds");
    if (fs.existsSync(angularSrc) && !fs.existsSync(angularDest)) {
      fs.mkdirSync(angularDest, { recursive: true });
      copyDirSync(angularSrc, angularDest, new Set(["dist", "node_modules"]));
    }
    // Add @mocha-ds/css as file: dependency for CSS resolution
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    pkg.dependencies = pkg.dependencies || {};
    pkg.dependencies["@mocha-ds/css"] = `file:${path.join(monorepoRoot, "packages", "css")}`;
    if (pkg.dependencies["@mocha-ds/angular"]) {
      delete pkg.dependencies["@mocha-ds/angular"];
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  } catch {}
}

export function findAngularTemplateDir(buildDir: string): string | null {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(buildDir, "..", "..", "..", "cli", "templates", "angular"),
    path.resolve(cwd, "node_modules", "@mocha", "cli", "templates", "angular"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "package.json"))) return c;
  }
  let dir = buildDir;
  for (let i = 0; i < 10; i++) {
    const c = path.join(dir, "packages", "cli", "templates", "angular");
    if (fs.existsSync(path.join(c, "package.json"))) return c;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export function findMonorepoRoot(from: string): string | null {
  let dir = from;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "packages", "core", "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

export function sanitizeAppName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function findQmlTsFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const walk = (d: string) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") walk(p);
      else if (e.name.endsWith(".qml.ts")) results.push(p);
    }
  };
  walk(dir);
  return results;
}

function copyDirSync(src: string, dest: string, skipDirs?: Set<string>): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skipDirs?.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(s, d, skipDirs);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}


