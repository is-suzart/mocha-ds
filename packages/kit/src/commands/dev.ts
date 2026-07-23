import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync, spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import {
  generateAllAngularFiles,
  startWebFileWatcher,
  copyAngularTemplate,
  applyPlaceholders,
  copyThemeCss,
  linkLocalPackages,
  findAngularTemplateDir,
  findMonorepoRoot,
  sanitizeAppName,
} from "../web-codegen.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger("dev");

export async function run(args: string[]): Promise<void> {
  const entry = args[0] || findEntry();
  const platformIdx = args.indexOf("--platform");
  const platform = platformIdx >= 0 ? (args[platformIdx + 1] ?? "desktop") : "desktop";

  if (!entry) {
    logger.error("No entry file found. Create src/App.qml.ts or specify one.");
    process.exit(1);
  }

  const entryPath = path.resolve(process.cwd(), entry);
  if (!fs.existsSync(entryPath)) {
    logger.error(`Entry file not found: ${entryPath}`);
    process.exit(1);
  }

  if (platform === "web") {
    await runWebDev(entryPath);
    return;
  }

  logger.info(`Starting dev server with hot reload...`);
  logger.info(`Entry: ${entry}`);
  logger.info(`[HMR] Watching for .qml.ts changes — edit and save to reload`);

  process.env.MOCHA_ENV = "development";
  process.env.MOCHA_ENTRY_DIR = path.dirname(entryPath);

  await import(entryPath);

  return new Promise(() => {});
}

async function runWebDev(entryPath: string): Promise<void> {
  const projectName = path.basename(path.dirname(entryPath)) || "mocha-app";
  const tempOutput = path.resolve(process.cwd(), ".mocha-web-temp");
  const sourceDir = path.dirname(entryPath);

  logger.info("[web] Generating Angular project...");
  process.env.MOCHA_PLATFORM = "web";

  if (fs.existsSync(tempOutput)) {
    fs.rmSync(tempOutput, { recursive: true, force: true });
  }

  const angularTemplateDir = findAngularTemplateDir(__dirname);
  if (!angularTemplateDir) {
    logger.error("Angular template not found. Ensure @mocha/cli is installed.");
    process.exit(1);
  }

  copyAngularTemplate(angularTemplateDir, tempOutput);

  const monorepoRoot = findMonorepoRoot(process.cwd());
  copyThemeCss(tempOutput, monorepoRoot);
  linkLocalPackages(tempOutput, monorepoRoot);

  const projectSlug = sanitizeAppName(projectName);
  applyPlaceholders(tempOutput, {
    "{{project_slug}}": projectSlug,
    "{{project_name}}": projectName,
  });

  logger.info("[web] Generating Angular components from .qml.ts files...");
  try {
    await generateAllAngularFiles(sourceDir, tempOutput, process.cwd(), entryPath);
  } catch (err) {
    logger.error("[web] Initial codegen failed:", err);
    process.exit(1);
  }

  logger.info("[web] Installing dependencies...");
  try {
    execSync("rm -rf node_modules 2>/dev/null; npm install --ignore-scripts --legacy-peer-deps 2>&1", {
      cwd: tempOutput,
      stdio: "inherit",
    });
  } catch {
    logger.warn("[web] npm install had issues — continuing anyway");
  }

  let ngServe: ChildProcess | null = null;
  let watcher = { close: () => {} };
  let closed = false;

  const cleanup = () => {
    if (closed) return;
    closed = true;
    watcher.close();
    if (ngServe) ngServe.kill("SIGKILL");
    try {
      if (fs.existsSync(tempOutput)) {
        fs.rmSync(tempOutput, { recursive: true, force: true });
      }
    } catch {}
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  logger.info("[web] Starting Angular dev server with HMR...");
  ngServe = spawn("npx", ["ng", "serve", "--open", "--host", "0.0.0.0"], {
    cwd: tempOutput,
    stdio: "inherit",
    shell: true,
  });

  ngServe.on("error", () => {
    logger.warn("[web] ng serve not available. Run manually:");
    logger.info(`  cd ${path.relative(process.cwd(), tempOutput)}`);
    cleanup();
  });

  ngServe.on("exit", (code) => {
    if (code !== 0 && code !== null && !closed) {
      logger.error(`[web] ng serve fechou com código ${code} — abortando`);
      cleanup();
    }
  });

  // Timeout: se não ficou pronto em 90s, assume falha
  const timeout = setTimeout(() => {
    if (!closed) {
      logger.error("[web] ng serve não ficou pronto em 90s — abortando");
      cleanup();
    }
  }, 90000);

  ngServe.on("spawn", () => {
    // Se chegou aqui, ng serve startou — cancela o timeout inicial
    // mas deixa um segundo timeout pra detectar falha de build inicial
    clearTimeout(timeout);
    setTimeout(() => {
      if (!closed) {
        logger.info("[web] ng serve está rodando (primeiro build pode ter falhado — veja os erros acima)");
      }
    }, 15000);
  });

  // Start file watcher for .qml.ts hot reload
  watcher = startWebFileWatcher(sourceDir, tempOutput, process.cwd(), (filename) => {
    logger.info(`[web-hmr] Angular files updated from ${filename}`);
  }, entryPath);

  return new Promise(() => {});
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
  return findQmlTsFile();
}

function findQmlTsFile(): string | null {
  const srcDir = path.resolve(process.cwd(), "src");
  if (!fs.existsSync(srcDir)) return null;
  try {
    for (const entry of fs.readdirSync(srcDir, { recursive: true })) {
      const name = String(entry);
      if (name.endsWith(".qml.ts")) {
        return path.join("src", name);
      }
    }
  } catch {}
  return null;
}
