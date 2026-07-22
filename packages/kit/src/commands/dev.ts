import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync, spawn } from "node:child_process";

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
  logger.info("[web] Generating Angular project...");

  process.env.MOCHA_PLATFORM = "web";

  const projectName = path.basename(path.dirname(entryPath)) || "mocha-app";
  const tempOutput = path.resolve(process.cwd(), ".mocha-web-temp");

  const { run: buildRun } = await import("./build.js");
  await buildRun([entryPath, "--output", tempOutput, "--platform", "web", "--name", projectName]);

  logger.info("");
  logger.info("[web] Installing dependencies...");
  execSync("npm install --ignore-scripts --legacy-peer-deps 2>&1 || true", {
    cwd: tempOutput,
    stdio: "inherit",
  });

  logger.info("[web] Starting Angular dev server...");
  const ngServe = spawn("npx", ["ng", "serve", "--open", "--host", "0.0.0.0"], {
    cwd: tempOutput,
    stdio: "inherit",
    shell: true,
  });

  ngServe.on("error", () => {
    logger.warn("[web] ng serve not available. Run manually:");
    logger.info(`  cd ${path.relative(process.cwd(), tempOutput)}`);
    logger.info("  npm install && npx ng serve");
  });

  return new Promise(() => {
    process.on("SIGINT", () => {
      ngServe.kill("SIGKILL");
      process.exit(0);
    });
  });
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
