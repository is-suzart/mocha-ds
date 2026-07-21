import { Logger } from "@mocha/shared";
import * as esbuild from "esbuild";
import * as fs from "node:fs";
import * as path from "node:path";

const logger = new Logger("build");

export interface BuildOptions {
  entry?: string;
  output?: string;
  minify?: boolean;
  sourceMap?: boolean;
  target?: string;
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

  if (!entry) {
    logger.error("No entry file specified and no default found");
    logger.info("Usage: mocha build <entry.qml.ts> [--output dist] [--minify]");
    process.exit(1);
  }

  const entryPath = path.resolve(process.cwd(), entry);
  const outputDir = path.resolve(process.cwd(), output);
  const targetPlatform = detectTarget(args);

  logger.info("Building Mocha application...");
  logger.info(`  Entry:    ${entry}`);
  logger.info(`  Output:   ${outputDir}`);
  logger.info(`  Minify:   ${minify}`);
  logger.info(`  Target:   ${targetPlatform}`);

  const startTime = performance.now();

  try {
    await buildProject({ entry: entryPath, output: outputDir, minify, sourceMap }, targetPlatform);
    const elapsed = (performance.now() - startTime).toFixed(0);
    logger.info(`Build completed in ${elapsed}ms`);
    logger.info(`Run with: node ${path.join(output, "run.js")}`);
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
    external: ["@mocha/native"],
    banner: {
      js: [
        "import { createRequire } from 'module';",
        "const require = createRequire(import.meta.url);",
      ].join("\n"),
    },
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
  return null;
}
