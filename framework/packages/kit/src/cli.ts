#!/usr/bin/env node

import { Logger } from "@mocha/shared";

const logger = new Logger("mocha-cli");

const HELP = `
🐻 Mocha Kit - The bear that tames the Qt

Usage:
  mocha <command> [options]

Commands:
  init <name>           Create a new Mocha project
  build [entry]         Build Mocha application (TS + QML → native)
  dev [entry]           Start development server with hot reload
  type-gen [source]     Generate TypeScript type definitions from QML/Qt
  serve                 Start DevTools server
  info                  Show project information

Options:
  --port, -p            Port for dev server (default: 8090)
  --output, -o          Output directory (default: dist)
  --watch, -w           Watch for changes
  --config, -c          Path to mocha.config.ts
  --help, -h            Show this help

Examples:
  mocha init my-app              Create new Mocha project
  mocha dev src/App.qml.ts       Start dev server
  mocha build src/App.qml.ts     Production build
  mocha type-gen ./src           Generate types
  mocha serve --port 9229        Start DevTools

Mocha v0.1.0 - https://github.com/mocha-framework/mocha
`;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help" || command === "-h") {
    console.log(HELP);
    process.exit(0);
  }

  switch (command) {
    case "init":
      await import("./commands/init.js").then((m) => m.run(args.slice(1)));
      break;
    case "build":
      await import("./commands/build.js").then((m) => m.run(args.slice(1)));
      break;
    case "dev":
      await import("./commands/dev.js").then((m) => m.run(args.slice(1)));
      break;
    case "type-gen":
      await import("./commands/type-gen.js").then((m) => m.run(args.slice(1)));
      break;
    case "serve":
      await import("./commands/serve.js").then((m) => m.run(args.slice(1)));
      break;
    case "info":
      await import("./commands/info.js").then((m) => m.run(args.slice(1)));
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
