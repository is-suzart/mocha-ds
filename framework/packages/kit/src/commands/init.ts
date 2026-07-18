import { Logger } from "@mocha/shared";
import * as fs from "node:fs";
import * as path from "node:path";

const logger = new Logger("init");

const PROJECT_TEMPLATE = {
  "package.json": JSON.stringify(
    {
      name: "mocha-app",
      version: "0.1.0",
      private: true,
      type: "module",
      scripts: {
        dev: "mocha dev src/App.qml.ts",
        build: "mocha build src/App.qml.ts",
        "type-gen": "mocha type-gen ./src",
      },
      dependencies: {
        "@mocha/core": "^0.1.0",
        "@mocha/qml": "^0.1.0",
      },
      devDependencies: {
        "@mocha/kit": "^0.1.0",
        typescript: "^5.5.0",
      },
    },
    null,
    2
  ),
  "tsconfig.json": JSON.stringify(
    {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        outDir: "dist",
        rootDir: "src",
        declaration: true,
      },
      include: ["src"],
    },
    null,
    2
  ),
  "src/App.qml.ts": `import {
  QObject,
  QProperty,
  QApplication,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml } from "@mocha/qml";

@QMLComponent({
  qml: qml\`
    import QtQuick 2.15

    Rectangle {
      width: 400; height: 200
      color: "#1a1a1a"

      Column {
        anchors.centerIn: parent

        Text {
          text: controller.title.value
          color: "white"
          font.pixelSize: 24
        }

        Text {
          text: controller.count.value.toString()
          color: "#4ec9b0"
          font.pixelSize: 48
        }

        Row {
          spacing: 10
          Button {
            text: "+"
            onClicked: controller.increment()
          }
          Button {
            text: "Reset"
            onClicked: controller.reset()
          }
        }
      }
    }
  \`,
})
export class AppController extends QObject {
  @qproperty title = new QProperty("Mocha App");
  @qproperty count = new QProperty(0);

  increment(): void {
    this.count.value += 1;
  }

  reset(): void {
    this.count.value = 0;
  }
}

export class MyApp {
  static main(): number {
    const app = new QApplication({
      appName: "Mocha App",
      appVersion: "0.1.0",
    });

    const controller = new AppController();
    app.exec();

    return 0;
  }
}

MyApp.main();
`,
  ".gitignore": `node_modules/
dist/
*.tsbuildinfo
.qts/
`,
};

export async function run(args: string[]): Promise<void> {
  const projectName = args[0] || "mocha-app";
  const projectDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    logger.error(`Directory already exists: ${projectDir}`);
    process.exit(1);
  }

  logger.info(`Creating Mocha project: ${projectName}`);

  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(path.join(projectDir, "src"), { recursive: true });

  for (const [filePath, content] of Object.entries(PROJECT_TEMPLATE)) {
    const fullPath = path.join(projectDir, filePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
    logger.info(`  Created: ${filePath}`);
  }

  logger.info("");
  logger.info(`Project created at: ${projectDir}`);
  logger.info("");
  logger.info("Next steps:");
  logger.info(`  cd ${projectName}`);
  logger.info("  npm install");
  logger.info("  npm run dev");
}
