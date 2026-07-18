import { Logger } from "@mocha/shared";
import { TypeGenerator, getAllQMLComponents, QMLTemplateParser } from "@mocha/qml";
import * as fs from "node:fs";
import * as path from "node:path";

const logger = new Logger("type-gen");

export async function run(args: string[]): Promise<void> {
  const sourceDir = args[0] || "src";
  const output = args.indexOf("--output") >= 0
    ? args[args.indexOf("--output") + 1]
    : args.indexOf("-o") >= 0
      ? args[args.indexOf("-o") + 1]
      : path.join(sourceDir, "mocha-types.d.ts");

  const sourcePath = path.resolve(process.cwd(), sourceDir);

  logger.info("Generating type definitions...");
  logger.info(`  Source: ${sourcePath}`);
  logger.info(`  Output: ${output}`);

  try {
    const generator = new TypeGenerator();

    const components = await discoverComponents(sourcePath);
    logger.info(`  Found ${components.length} components`);

    if (components.length === 0) {
      logger.info("  Generating base widget types only");
      const types = generator.generateDTSFromWidgets(getBuiltinWidgets());
      writeOutput(output, types);
      return;
    }

    const documents: Array<{ name: string; document: any }> = [];
    for (const comp of components) {
      try {
        const content = fs.readFileSync(comp.path, "utf-8");
        const componentName = path.basename(comp.path, ".qml.ts");
        const document = parseDocumentFromSource(content);
        if (document) {
          documents.push({ name: componentName, document });
        }
      } catch (err) {
        logger.warn(`Skipping ${comp.path}:`, err);
      }
    }

    const types = generator.generateProjectTypes(documents);
    writeOutput(output, types);

    logger.info("Type generation complete!");
  } catch (err) {
    logger.error("Type generation failed:", err);
    process.exit(1);
  }
}

interface ComponentDiscovery {
  path: string;
  name: string;
}

async function discoverComponents(
  dir: string
): Promise<ComponentDiscovery[]> {
  const result: ComponentDiscovery[] = [];

  if (!fs.existsSync(dir)) return result;

  const walkDir = (currentDir: string) => {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith(".")) {
        walkDir(fullPath);
      } else if (entry.name.endsWith(".qml.ts")) {
        const content = fs.readFileSync(fullPath, "utf-8");
        if (content.includes("@QMLComponent")) {
          result.push({ path: fullPath, name: entry.name });
        }
      }
    }
  };

  walkDir(dir);
  return result;
}

function parseDocumentFromSource(content: string): any {
  const qmlMatch = content.match(
    /qml:\s*(?:qml)?\s*(`[\s\S]*?`)/
  );

  if (qmlMatch) {
    const templateContent = qmlMatch[1].slice(1, -1);
    const parser = new QMLTemplateParser();
    return parser.parse(templateContent);
  }

  return null;
}

function getBuiltinWidgets(): Record<string, string> {
  return {
    Item: "QQuickItemBase",
    Rectangle: "QQuickItemBase",
    Text: "QQuickItemBase",
    Image: "QQuickItemBase",
    MouseArea: "QQuickItemBase",
    Button: "QQuickAbstractButton",
    TextField: "QQuickItemBase",
    Column: "QQuickItemBase",
    Row: "QQuickItemBase",
    ListView: "QQuickFlickable",
    GridView: "QQuickFlickable",
    Flickable: "QQuickItemBase",
    Loader: "QQuickItemBase",
    Timer: "QQuickItemBase",
    NumberAnimation: "QQuickItemBase",
    PropertyChanges: "QQuickItemBase",
    Repeater: "QQuickItemBase",
    Flow: "QQuickItemBase",
    Grid: "QQuickItemBase",
    ScrollView: "QQuickItemBase",
    StackView: "QQuickItemBase",
    SwipeView: "QQuickItemBase",
    TabBar: "QQuickItemBase",
    ToolBar: "QQuickItemBase",
    Popup: "QQuickItemBase",
    Drawer: "QQuickItemBase",
    Dialog: "QQuickItemBase",
    SpinBox: "QQuickItemBase",
    Slider: "QQuickItemBase",
    ComboBox: "QQuickItemBase",
    CheckBox: "QQuickAbstractButton",
    RadioButton: "QQuickAbstractButton",
    Switch: "QQuickAbstractButton",
    Label: "QQuickItemBase",
    GroupBox: "QQuickItemBase",
  };
}

function writeOutput(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  logger.info(`  Written to: ${filePath}`);
}
