import { Logger } from "@mocha/shared";
import * as esbuild from "esbuild";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger("build");

export interface BuildOptions {
  entry?: string;
  output?: string;
  minify?: boolean;
  sourceMap?: boolean;
  target?: string;
  format?: "deb" | "appimage" | "exe" | "dmg";
  name?: string;
  version?: string;
}

export async function run(args: string[]): Promise<void> {
  const entry = args[0] || findEntry();
  const output = args.indexOf("--output") >= 0
    ? args[args.indexOf("--output") + 1]
    : args.indexOf("-o") >= 0
      ? args[args.indexOf("-o") + 1]
      : "dist";

  const minify = args.includes("--minify");
  const sourceMap = !args.includes("--no-sourcemap");
  const format = parseFormat(args);
  const appName = parseOpt(args, "--name", detectAppName());
  const appVersion = parseOpt(args, "--app-version", "0.1.0");
  const cliIcon = parseOpt(args, "--icon", "");
  const platform = parseOpt(args, "--platform", "desktop");

  if (!entry) {
    logger.error("No entry file specified and no default found");
    logger.info("Usage: mocha build <entry.qml.ts> [--output dist] [--minify]");
    process.exit(1);
  }

  if (platform === "web") {
    process.env.MOCHA_PLATFORM = "web";
  }

  const entryPath = path.resolve(process.cwd(), entry);
  const outputDir = path.resolve(process.cwd(), output);
  const targetPlatform = detectTarget(args);

  const appMeta = readAppMetaFromSource(entryPath);
  const finalName = appName !== detectAppName() ? appName : (appMeta.name || appName);
  const iconPath = platform !== "web"
    ? resolveIcon(cliIcon || undefined, appMeta, entryPath, sanitizeAppName(finalName))
    : undefined;

  logger.info("Building Mocha application...");
  logger.info(`  Entry:    ${entry}`);
  logger.info(`  Output:   ${outputDir}`);
  logger.info(`  Minify:   ${minify}`);
  logger.info(`  Target:   ${targetPlatform}`);
  logger.info(`  Platform: ${platform}`);
  if (format) logger.info(`  Format:   ${format}`);

  const startTime = performance.now();

  try {
    if (platform === "web") {
      await buildWebProject({ entry: entryPath, output: outputDir, minify, sourceMap }, finalName);
    } else {
      await buildProject({ entry: entryPath, output: outputDir, minify, sourceMap }, targetPlatform);
    }
    const elapsed = (performance.now() - startTime).toFixed(0);
    logger.info(`Build completed in ${elapsed}ms`);

    if (platform !== "web") {
      if (format) {
        await packageProject(outputDir, format, { name: finalName, version: appVersion, target: targetPlatform, icon: iconPath, appMeta });
      } else {
        logger.info(`Run with: node ${path.join(output, "run.js")}`);
      }
    }
  } catch (err) {
    logger.error("Build failed:", err);
    process.exit(1);
  }
}

async function buildProject(
  options: { entry: string; output: string; minify: boolean; sourceMap: boolean },
  targetPlatform: string
): Promise<void> {
  const { entry, output, minify, sourceMap } = options;
  const outputDir = output;

  if (!fs.existsSync(entry)) {
    throw new Error(`Entry file not found: ${entry}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const outfile = path.join(outputDir, "app.js");

  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    minify,
    sourcemap: sourceMap,
    external: ["@mocha/native", "@mocha/mobile"],
  });

  logger.info(`  Bundled JS: ${outfile}`);

  copyNativeBinary(outputDir, targetPlatform);

  writePackageJson(outputDir);
  writeRunScript(outputDir);

  logger.info(`  Output: ${outputDir}/`);
}

function copyNativeBinary(outputDir: string, targetPlatform: string): void {
  const me = detectMyPlatform();
  if (targetPlatform !== me) {
    logger.warn(
      `Cross-compilation requested (${me} → ${targetPlatform}). ` +
      "Native binary for target platform must be placed manually at: " +
      `${outputDir}/mocha-native.${targetPlatform}.node`
    );
    return;
  }

  const nativeDir = findNativePackageDir();
  if (!nativeDir) {
    logger.warn("@mocha/native not found — native binary will not be bundled");
    return;
  }

  const triples: Record<string, string> = {
    "linux-x64": "mocha-native.linux-x64-gnu.node",
    "linux-arm64": "mocha-native.linux-arm64-gnu.node",
    "darwin-x64": "mocha-native.darwin-x64.node",
    "darwin-arm64": "mocha-native.darwin-arm64.node",
    "win32-x64": "mocha-native.win32-x64-msvc.node",
  };

  const binaryName = triples[me];
  if (!binaryName) {
    logger.warn(`Unsupported platform: ${me}`);
    return;
  }

  const srcPath = path.join(nativeDir, binaryName);
  const destPath = path.join(outputDir, binaryName);

  if (!fs.existsSync(srcPath)) {
    logger.warn(
      `Native binary not found: ${srcPath}. Build it first: ` +
      `cd packages/native && npx napi build --platform --release`
    );
    return;
  }

  fs.copyFileSync(srcPath, destPath);
  logger.info(`  Native: ${binaryName}`);
}

function detectMyPlatform(): string {
  const arch = process.arch === "x64" ? "x64" : process.arch === "arm64" ? "arm64" : process.arch;
  return `${process.platform}-${arch}`;
}

function detectTarget(args: string[]): string {
  const idx = args.indexOf("--target");
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return detectMyPlatform();
}

function findNativePackageDir(): string | null {
  const candidates = [
    path.resolve(process.cwd(), "node_modules", "@mocha", "native"),
    path.resolve(process.cwd(), "..", "packages", "native"),
    path.resolve(process.cwd(), "packages", "native"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function writePackageJson(outputDir: string): void {
  const pkg = { type: "module" };
  fs.writeFileSync(path.join(outputDir, "package.json"), JSON.stringify(pkg, null, 2));
}

function writeRunScript(outputDir: string): void {
  const runScript = "node app.js";
  fs.writeFileSync(path.join(outputDir, "run.sh"), `#!/usr/bin/env sh\n${runScript}\n`, { mode: 0o755 });
  fs.writeFileSync(path.join(outputDir, "run.bat"), `${runScript}\n`);
}

function findEntry(): string | null {
  const candidates = [
    "src/App.qml.ts",
    "src/app.qml.ts",
    "src/main.qml.ts",
    "src/index.qml.ts",
    "App.qml.ts",
    "index.qml.ts",
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(path.resolve(process.cwd(), candidate))) {
      return candidate;
    }
  }
  const srcDir = path.resolve(process.cwd(), "src");
  if (fs.existsSync(srcDir)) {
    try {
      for (const entry of fs.readdirSync(srcDir, { recursive: true })) {
        const name = String(entry);
        if (name.endsWith(".qml.ts")) {
          return path.join("src", name);
        }
      }
    } catch {}
  }
  return null;
}

function parseFormat(args: string[]): BuildOptions["format"] {
  const idx = args.indexOf("--format");
  if (idx >= 0 && args[idx + 1]) {
    const fmt = args[idx + 1];
    if (["deb", "appimage", "exe", "dmg"].includes(fmt)) {
      return fmt as BuildOptions["format"];
    }
    logger.warn(`Unknown format: ${fmt}. Valid: deb, appimage, exe, dmg`);
  }
  return undefined;
}

function parseOpt(args: string[], flag: string, fallback: string): string {
  const idx = args.indexOf(flag);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  return fallback;
}

interface AppMeta {
  name?: string;
  description?: string;
  color?: string;
  icons?: { svg?: string; png_192?: string; png_512?: string; ico?: string; icns?: string };
  platforms?: {
    linux?: { categories?: string[]; terminal?: boolean };
    windows?: { appId?: string };
    mac?: { bundleId?: string };
  };
}

function readAppMetaFromSource(entryPath: string): AppMeta {
  try {
    const source = fs.readFileSync(entryPath, "utf-8");
    const match = source.match(/@AppMeta\s*\(\s*\{([\s\S]*?)\}\s*\)/);
    if (!match) return {};

    const body = match[1];
    const name = body.match(/name:\s*["']([^"']+)["']/);
    const description = body.match(/description:\s*["']([^"']+)["']/);
    const color = body.match(/color:\s*["']([^"']+)["']/);
    const svg = body.match(/svg:\s*["']([^"']+)["']/);
    const png = body.match(/png_192:\s*["']([^"']+)["']/) || body.match(/png_512:\s*["']([^"']+)["']/);
    const catMatch = body.match(/categories:\s*\[([\s\S]*?)\]/);
    const terminalMatch = body.match(/terminal:\s*(true|false)/);
    const appId = body.match(/appId:\s*["']([^"']+)["']/);
    const bundleId = body.match(/bundleId:\s*["']([^"']+)["']/);

    const result: AppMeta = {};
    if (name) result.name = name[1];
    if (description) result.description = description[1];
    if (color) result.color = color[1];

    if (svg || png) {
      result.icons = {};
      if (svg) result.icons.svg = svg[1];
      else if (png) result.icons.png_192 = png[1];
    }

    const categories = catMatch?.[1]
      ?.split(",")
      .map((s: string) => s.trim().replace(/["']/g, ""))
      .filter(Boolean);
    const terminal = terminalMatch?.[1] === "true" ? true : terminalMatch?.[1] === "false" ? false : undefined;

    if (categories || terminal !== undefined) {
      result.platforms = {};
      if (categories || terminal !== undefined) {
        result.platforms.linux = {};
        if (categories) result.platforms.linux.categories = categories;
        if (terminal !== undefined) result.platforms.linux.terminal = terminal;
      }
    }
    if (appId) {
      result.platforms = result.platforms || {};
      result.platforms.windows = { appId: appId[1] };
    }
    if (bundleId) {
      result.platforms = result.platforms || {};
      result.platforms.mac = { bundleId: bundleId[1] };
    }

    return result;
  } catch {
    return {};
  }
}

function resolveIcon(cliIcon: string | undefined, appMeta: AppMeta, entryPath: string, appName: string): string | undefined {
  if (cliIcon) {
    const resolved = path.isAbsolute(cliIcon) ? cliIcon : path.resolve(process.cwd(), cliIcon);
    if (fs.existsSync(resolved)) return resolved;
    logger.warn(`[icon] --icon path not found: ${resolved}`);
  }

  const iconRel = appMeta.icons?.svg || appMeta.icons?.png_192 || appMeta.icons?.png_512;
  if (iconRel) {
    const resolved = path.resolve(path.dirname(entryPath), iconRel);
    if (fs.existsSync(resolved)) return resolved;
    logger.warn(`[icon] @AppMeta icon not found: ${resolved}`);
  }

  const placeholderPath = path.resolve(path.dirname(entryPath), `${appName}.svg`);
  const svg = generatePlaceholderSvg(appName, appMeta.color || "#4A90D9");
  fs.writeFileSync(placeholderPath, svg);
  logger.info(`[icon] Generated placeholder: ${placeholderPath}`);
  return placeholderPath;
}

function generatePlaceholderSvg(name: string, color: string): string {
  const initial = name.charAt(0).toUpperCase();
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256">`,
    `  <rect width="256" height="256" rx="32" fill="${color}"/>`,
    `  <text x="128" y="160" text-anchor="middle" fill="white" font-size="120" font-family="sans-serif">${initial}</text>`,
    `</svg>`,
    "",
  ].join("\n");
}

function detectAppName(): string {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"));
    return pkg.name || "mocha-app";
  } catch {
    return "mocha-app";
  }
}

function sanitizeAppName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

interface PackageMeta {
  name: string;
  version: string;
  target: string;
  icon?: string;
  appMeta: AppMeta;
}

async function buildWebProject(
  options: { entry: string; output: string; minify: boolean; sourceMap: boolean },
  projectName: string
): Promise<void> {
  const { entry, output } = options;
  const outputDir = output;

  if (!fs.existsSync(entry)) {
    throw new Error(`Entry file not found: ${entry}`);
  }
  fs.mkdirSync(outputDir, { recursive: true });

  const angularTemplateDir = findAngularTemplateDir();
  if (!angularTemplateDir) throw new Error("Angular template not found.");

  copyDirSync(angularTemplateDir, outputDir);
  process.env.MOCHA_PLATFORM = "web";

  const projectDir = process.cwd();
  const sourceDir = path.dirname(entry);
  const qmlFiles = findQmlTsFiles(sourceDir);
  const fsPromises = await import("node:fs/promises");

  let isFirstFile = true;
  for (const qmlFile of qmlFiles) {
    const relativePath = path.relative(sourceDir, qmlFile);
    logger.info(`  Processing: ${relativePath}`);
    try {
      const tsx = path.resolve(projectDir, "node_modules", ".bin", "tsx");
      const tempFile = path.join(projectDir, ".codegen-temp.mjs");
      const isMain = isFirstFile;
      isFirstFile = false;

      await fsPromises.writeFile(tempFile, `
import { getAllQMLComponents, generateAngularComponent } from "@mocha/qml";
import { pathToFileURL } from "node:url";

try { await import(pathToFileURL(${JSON.stringify(qmlFile)}).href); }
catch (e) { console.error("[codegen] Failed to import entry:", e.message); }

import * as fs from "node:fs";
import * as path from "node:path";
const outputDir = ${JSON.stringify(outputDir)};
const isMain = ${JSON.stringify(isMain)};

for (const [ctor, meta] of getAllQMLComponents().entries()) {
  if (meta.platform !== "web") continue;
  const files = generateAngularComponent(ctor);
  if (files.serviceTs) {
    const svcDir = path.join(outputDir, "src", "app");
    fs.mkdirSync(svcDir, { recursive: true });
    fs.writeFileSync(path.join(svcDir, toKebab(meta.componentName) + ".service.ts"), files.serviceTs);
    console.log("[codegen] Service:", meta.componentName);
  }
  if (isMain) {
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
function toKebab(s) { return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(); }
`);
      execSync(`${tsx} ${tempFile}`, { cwd: projectDir, stdio: "inherit" });
      fs.unlinkSync(tempFile);
    } catch (err) {
      logger.error(`Codegen error for ${qmlFile}:`, err);
    }
  }

  try {
    const cssDistDir = path.join(findMonorepoRoot(process.cwd()) || process.cwd(), "packages", "css", "dist");
    const cssFile = path.join(cssDistDir, "catppuccin.css");
    if (fs.existsSync(cssFile)) {
      const themeDir = path.join(outputDir, "src", "app");
      fs.mkdirSync(themeDir, { recursive: true });
      fs.copyFileSync(cssFile, path.join(themeDir, "theme.css"));
      logger.info("[web] Copied theme CSS from @mocha-ds/css/dist");
    }
  } catch (_e: any) {}

  const projectSlug = sanitizeAppName(projectName);
  applyPlaceholders(outputDir, { "{{project_slug}}": projectSlug, "{{project_name}}": projectName });

  const monorepoRoot = findMonorepoRoot(process.cwd());
  if (monorepoRoot) {
    const pkgPath = path.join(outputDir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies["@mocha-ds/angular"] = `file:${path.join(monorepoRoot, "packages", "angular")}`;
        pkg.dependencies["@mocha-ds/css"] = `file:${path.join(monorepoRoot, "packages", "css")}`;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      } catch {}
    }
  }

  logger.info("");
  logger.info("Angular project generated at: " + outputDir);
  logger.info("To run: cd " + path.relative(process.cwd(), outputDir) + " && npm install && npm run dev");
}

function findAngularTemplateDir(): string | null {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(__dirname, "..", "..", "..", "cli", "templates", "angular"),
    path.resolve(cwd, "node_modules", "@mocha", "cli", "templates", "angular"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "package.json"))) return c;
  }
  let dir = __dirname;
  for (let i = 0; i < 10; i++) {
    const c = path.join(dir, "packages", "cli", "templates", "angular");
    if (fs.existsSync(path.join(c, "package.json"))) return c;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function copyDirSync(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

function findQmlTsFiles(dir: string): string[] {
  const results: string[] = [];
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

function applyPlaceholders(dir: string, placeholders: Record<string, string>): void {
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

function findMonorepoRoot(from: string): string | null {
  let dir = from;
  for (let i = 0; i < 10; i++) {
    if (fs.existsSync(path.join(dir, "packages", "core", "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

async function packageProject(distDir: string, format: string, meta: PackageMeta): Promise<void> {
  if (format === "deb") {
    if (process.platform !== "linux") {
      logger.warn("[package] .deb requires Linux — skipping");
      return;
    }
    const { packageDeb } = await import("./package-deb.js");
    await packageDeb(distDir, meta);
    return;
  }

  if (format === "appimage") {
    if (process.platform !== "linux") {
      logger.warn("[package] .AppImage requires Linux — skipping");
      return;
    }
    const { packageAppImage } = await import("./package-appimage.js");
    await packageAppImage(distDir, meta);
    return;
  }

  if (format === "exe") {
    const { packageExe } = await import("./package-exe.js");
    await packageExe(distDir, meta);
    return;
  }

  if (format === "dmg") {
    logger.warn("[package] .dmg packaging not yet implemented");
    return;
  }
}
