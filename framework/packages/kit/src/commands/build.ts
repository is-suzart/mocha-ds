import { Logger } from "@mocha/shared";
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
    logger.info("Usage: ursa build <entry.qml.ts> [--output dist] [--minify]");
    process.exit(1);
  }

  const options: BuildOptions = {
    entry,
    output,
    minify,
    sourceMap,
  };

  logger.info(`Building Mocha application...`);
  logger.info(`  Entry:   ${entry}`);
  logger.info(`  Output:  ${output}`);
  logger.info(`  Minify:  ${minify}`);
  logger.info(`  SourceMap: ${sourceMap}`);

  const startTime = performance.now();

  try {
    await buildProject(options);
    const elapsed = (performance.now() - startTime).toFixed(0);
    logger.info(`Build completed in ${elapsed}ms`);
  } catch (err) {
    logger.error("Build failed:", err);
    process.exit(1);
  }
}

async function buildProject(options: BuildOptions): Promise<void> {
  const outputDir = path.resolve(process.cwd(), options.output!);
  const entryPath = path.resolve(process.cwd(), options.entry!);

  if (!fs.existsSync(entryPath)) {
    throw new Error(`Entry file not found: ${entryPath}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const stats = await analyzeProject();
  logger.info(`  Files:   ${stats.fileCount}`);
  logger.info(`  Components: ${stats.componentCount}`);
  logger.info(`  QML templates: ${stats.qmlCount}`);

  logger.info("  Output written to:", outputDir);
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

async function analyzeProject(): Promise<{
  fileCount: number;
  componentCount: number;
  qmlCount: number;
}> {
  let fileCount = 0;
  let componentCount = 0;
  let qmlCount = 0;

  const srcDir = path.resolve(process.cwd(), "src");
  if (fs.existsSync(srcDir)) {
    const walkDir = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) walkDir(fullPath);
        else if (entry.name.endsWith(".qml.ts")) {
          fileCount++;
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes("@QMLComponent")) componentCount++;
          if (content.includes("qml`")) qmlCount++;
        }
      }
    };
    walkDir(srcDir);
  }

  return { fileCount, componentCount, qmlCount };
}
