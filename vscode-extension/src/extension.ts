// ============================================================
// src/extension.ts
// Ponto de entrada principal da extensão Mocha-DS QML IntelliSense.
//
// Registra três providers para arquivos .qml e .qml.ts:
//   1. CompletionItemProvider — sugere componentes e props
//   2. HoverProvider          — documentação Markdown ao passar o mouse
//   3. SignatureHelpProvider  — (futuro) assinatura de funções
// ============================================================

import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import {
  COMPONENTS,
  COMPONENT_NAMES,
  getComponent,
  CATPPUCCIN_COLORS,
  TYPOGRAPHY_TOKENS,
  SPACING_TOKENS,
  GEOMETRY_TOKENS,
  PropDefinition,
} from "./componentData";

// ────────────────────────────────────────────────────────────
// REGEX HELPERS
// ────────────────────────────────────────────────────────────

/** Detecta se o cursor está dentro de um bloco de componente MochaDS.
 *  Ex: cursor depois de `Button {` ou `Modal {\n  `
 *  Captura o nome do componente: grupo 1 */
const COMPONENT_BLOCK_RE = /\b([A-Z][a-zA-Z]+)\s*\{/;

/** Detecta se a linha atual está digitando um valor de string entre aspas.
 *  Ex: `variant: "${cursor}"` */
const STRING_VALUE_RE = /\b(\w+)\s*:\s*["']([^"']*)$/;

/** Detecta referência a token do Theme.
 *  Ex: `color: Theme.colors.` ou `spacing: Theme.spacing.` */
const THEME_TOKEN_RE = /Theme\.(colors|spacing|geometry|typography)\.(\w*)$/;

/** Detecta se está digitando um nome de componente no início de uma linha */
const COMPONENT_NAME_RE = /^(\s*)([A-Z][a-zA-Z]*)$/;

// ────────────────────────────────────────────────────────────
// HELPERS DE DOCUMENTAÇÃO MARKDOWN
// ────────────────────────────────────────────────────────────

function buildHoverMarkdown(name: string): vscode.MarkdownString | null {
  const comp = getComponent(name);
  if (!comp) return null;

  const md = new vscode.MarkdownString(undefined, true);
  md.isTrusted = true;
  md.supportHtml = true;

  // Cabeçalho
  md.appendMarkdown(`## \`${comp.name}\` — ${comp.category}\n\n`);
  md.appendMarkdown(`${comp.description}\n\n`);

  // Props table
  if (comp.props.length > 0) {
    md.appendMarkdown(`### Props\n\n`);
    md.appendMarkdown(`| Prop | Tipo | Default | Descrição |\n`);
    md.appendMarkdown(`|------|------|---------|----------|\n`);
    for (const p of comp.props) {
      const required = p.required ? " *(obrigatório)*" : "";
      const vals = p.values ? ` \`${p.values.join("\\|")}\`` : "";
      md.appendMarkdown(
        `| \`${p.name}\` | \`${p.type}\`${vals} | \`${p.default ?? "—"}\` | ${p.description}${required} |\n`
      );
    }
    md.appendMarkdown("\n");
  }

  // Signals
  if (comp.signals && comp.signals.length > 0) {
    md.appendMarkdown(`### Signals\n\n`);
    for (const s of comp.signals) {
      const params = s.params ? `(${s.params})` : "()";
      md.appendMarkdown(`- \`${s.name}${params}\` — ${s.description}\n`);
    }
    md.appendMarkdown("\n");
  }

  // Methods
  if (comp.methods && comp.methods.length > 0) {
    md.appendMarkdown(`### Métodos\n\n`);
    for (const m of comp.methods) {
      md.appendMarkdown(`- \`${m}\`\n`);
    }
    md.appendMarkdown("\n");
  }

  // Slots
  if (comp.slots && comp.slots.length > 0) {
    md.appendMarkdown(`### Slots\n\n`);
    for (const s of comp.slots) {
      md.appendMarkdown(`- ${s}\n`);
    }
    md.appendMarkdown("\n");
  }

  // Exemplo
  if (comp.example) {
    md.appendMarkdown(`### Exemplo\n\n`);
    md.appendCodeblock(comp.example, "qml");
  }

  return md;
}

// ────────────────────────────────────────────────────────────
// COMPLETION HELPERS
// ────────────────────────────────────────────────────────────

/** Cria CompletionItem para um prop de um componente */
function propToCompletionItem(prop: PropDefinition): vscode.CompletionItem {
  const item = new vscode.CompletionItem(
    prop.name,
    vscode.CompletionItemKind.Property
  );

  // Detail (tooltip curto)
  item.detail = `${prop.type}${prop.default ? ` = ${prop.default}` : ""}${prop.required ? " (obrigatório)" : ""}`;

  // Documentation markdown
  const md = new vscode.MarkdownString();
  md.appendMarkdown(prop.description);
  if (prop.values) {
    md.appendMarkdown(`\n\nValores aceitos: \`${prop.values.join("` | `")}\``);
  }
  item.documentation = md;

  // SnippetString para inserção inteligente
  if (prop.values && prop.values.length > 0) {
    // Enum — oferece choices via snippet
    const choices = prop.values.join(",");
    item.insertText = new vscode.SnippetString(
      `${prop.name}: \${1|${choices}|}`
    );
  } else if (prop.type === "bool") {
    item.insertText = new vscode.SnippetString(
      `${prop.name}: \${1|true,false|}`
    );
  } else if (prop.type === "string") {
    item.insertText = new vscode.SnippetString(`${prop.name}: "\$1"`);
  } else {
    item.insertText = new vscode.SnippetString(`${prop.name}: \$1`);
  }

  // Obrigatórios primeiro
  item.sortText = prop.required ? `!${prop.name}` : prop.name;

  return item;
}

/** Cria CompletionItem para um componente MochaDS inteiro */
function componentToCompletionItem(name: string): vscode.CompletionItem {
  const comp = getComponent(name);
  const item = new vscode.CompletionItem(name, vscode.CompletionItemKind.Class);

  if (comp) {
    item.detail = `MochaDS — ${comp.category}`;
    item.documentation = buildHoverMarkdown(name) ?? undefined;

    // Snippet: cria bloco com as props obrigatórias pré-preenchidas
    const requiredProps = comp.props
      .filter(p => p.required)
      .map((p, i) => `    ${p.name}: \$${i + 1}`);

    const bodyLines = requiredProps.length > 0
      ? `\n${requiredProps.join("\n")}\n    $${requiredProps.length + 1}\n`
      : "\n    $1\n";

    item.insertText = new vscode.SnippetString(`${name} {${bodyLines}}`);
    item.command = { command: "editor.action.triggerSuggest", title: "Re-trigger" };
  }

  return item;
}

// ────────────────────────────────────────────────────────────
// 1. COMPLETION ITEM PROVIDER
// ────────────────────────────────────────────────────────────

const completionProvider: vscode.CompletionItemProvider = {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.CompletionItem[] {
    const linePrefix = document.lineAt(position).text.slice(0, position.character);
    const items: vscode.CompletionItem[] = [];

    // ── A. Usuário digitando um nome de componente no início da linha ──
    if (COMPONENT_NAME_RE.test(linePrefix)) {
      // Sugerir todos os componentes MochaDS
      for (const name of COMPONENT_NAMES) {
        items.push(componentToCompletionItem(name));
      }
      return items;
    }

    // ── B. Token do Theme (Theme.colors., Theme.spacing., etc.) ──
    const themeMatch = linePrefix.match(THEME_TOKEN_RE);
    if (themeMatch) {
      const group = themeMatch[1];

      if (group === "colors") {
        const colorTokens = [
          "base", "mantle", "crust", "text", "subtext1", "subtext0",
          "overlay2", "overlay1", "overlay0", "surface2", "surface1", "surface0",
          "primary", "secondary", "success", "warning", "danger", "info",
          ...CATPPUCCIN_COLORS,
        ];
        for (const color of colorTokens) {
          const ci = new vscode.CompletionItem(color, vscode.CompletionItemKind.Color);
          ci.detail = `Theme.colors.${color}`;
          items.push(ci);
        }
      } else if (group === "spacing") {
        for (const t of SPACING_TOKENS) {
          const ci = new vscode.CompletionItem(t, vscode.CompletionItemKind.Value);
          ci.detail = `Theme.spacing.${t}`;
          items.push(ci);
        }
      } else if (group === "geometry") {
        for (const t of GEOMETRY_TOKENS) {
          const ci = new vscode.CompletionItem(t, vscode.CompletionItemKind.Value);
          ci.detail = `Theme.geometry.${t}`;
          items.push(ci);
        }
      } else if (group === "typography") {
        for (const t of TYPOGRAPHY_TOKENS) {
          const ci = new vscode.CompletionItem(t, vscode.CompletionItemKind.Value);
          ci.detail = `Theme.typography.${t}`;
          items.push(ci);
        }
      }
      return items;
    }

    // ── C. Dentro de um bloco de componente — sugerir props ──
    // Precisa encontrar qual componente está no contexto acima do cursor
    const componentName = findEnclosingComponent(document, position);
    if (componentName) {
      const comp = getComponent(componentName);
      if (comp) {
        for (const prop of comp.props) {
          items.push(propToCompletionItem(prop));
        }

        // Adicionar snippets de signals (onClicked, onToggled, etc.)
        if (comp.signals) {
          for (const sig of comp.signals) {
            const handlerName = `on${sig.name.charAt(0).toUpperCase()}${sig.name.slice(1)}`;
            const sigItem = new vscode.CompletionItem(
              handlerName,
              vscode.CompletionItemKind.Event
            );
            sigItem.detail = `signal handler`;
            sigItem.documentation = new vscode.MarkdownString(sig.description);
            if (sig.params) {
              sigItem.insertText = new vscode.SnippetString(
                `${handlerName}: function(${sig.params.split(",").map((_, i) => `p${i}`).join(", ")}) {\n    $1\n}`
              );
            } else {
              sigItem.insertText = new vscode.SnippetString(`${handlerName}: $1`);
            }
            items.push(sigItem);
          }
        }

        return items;
      }
    }

    // ── D. Sugestão de valor de string (variant: "..." etc.) ──
    const strMatch = linePrefix.match(STRING_VALUE_RE);
    if (strMatch) {
      const propName = strMatch[1];
      const comp2Name = findEnclosingComponent(document, position);
      if (comp2Name) {
        const comp2 = getComponent(comp2Name);
        const prop = comp2?.props.find(p => p.name === propName);
        if (prop?.values) {
          for (const val of prop.values) {
            const ci = new vscode.CompletionItem(val, vscode.CompletionItemKind.EnumMember);
            ci.insertText = val; // sem aspas — já estão na linha
            items.push(ci);
          }
          return items;
        }
      }
    }

    return items;
  },
};

// ────────────────────────────────────────────────────────────
// 2. HOVER PROVIDER
// ────────────────────────────────────────────────────────────

const hoverProvider: vscode.HoverProvider = {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Hover | null {
    // Pega a palavra sob o cursor
    const wordRange = document.getWordRangeAtPosition(
      position,
      /[A-Z][a-zA-Z]+/
    );
    if (!wordRange) return null;

    const word = document.getText(wordRange);
    const md = buildHoverMarkdown(word);
    if (!md) return null;

    return new vscode.Hover(md, wordRange);
  },
};

// ────────────────────────────────────────────────────────────
// 3. CODE ACTIONS — Auto-import MochaDS
// ────────────────────────────────────────────────────────────

const importActionProvider: vscode.CodeActionProvider = {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] {
    const line = document.lineAt(range.start.line).text;

    // Verifica se a palavra na linha é um componente MochaDS
    const match = line.match(/\b([A-Z][a-zA-Z]+)\b/);
    if (!match) return [];

    const componentName = match[1];
    if (!COMPONENT_NAMES.includes(componentName)) return [];

    // Verifica se já existe import de MochaDS no arquivo
    const fullText = document.getText();
    if (
      fullText.includes('import ".." as DS') ||
      fullText.includes("import MochaDS")
    ) {
      return [];
    }

    // Lê configuração do usuário
    const cfg = vscode.workspace.getConfiguration("mochads");
    const style = cfg.get<string>("moduleStyle", "relative");
    const alias = cfg.get<string>("importAlias", "DS");

    const importLine =
      style === "module"
        ? "import MochaDS 1.0"
        : `import ".." as ${alias}`;

    const action = new vscode.CodeAction(
      `Adicionar import do MochaDS (${importLine})`,
      vscode.CodeActionKind.QuickFix
    );

    // Insere o import na primeira linha do arquivo
    action.edit = new vscode.WorkspaceEdit();
    action.edit.insert(document.uri, new vscode.Position(0, 0), importLine + "\n");
    action.isPreferred = true;

    return [action];
  },
};

// ────────────────────────────────────────────────────────────
// UTILITÁRIO: encontra o componente que envolve o cursor
// ────────────────────────────────────────────────────────────

function findEnclosingComponent(
  document: vscode.TextDocument,
  position: vscode.Position
): string | null {
  // Varre do cursor para cima procurando uma linha com padrão ComponentName {
  const maxLinesToSearch = 50;
  let braceDepth = 0;

  for (
    let i = position.line;
    i >= Math.max(0, position.line - maxLinesToSearch);
    i--
  ) {
    const lineText = document.lineAt(i).text;

    // Conta chaves da linha atual (de trás para frente se for a linha do cursor)
    const closeBraces = (lineText.match(/\}/g) || []).length;
    const openBraces = (lineText.match(/\{/g) || []).length;

    if (i === position.line) {
      braceDepth += closeBraces - openBraces;
    } else {
      braceDepth += closeBraces - openBraces;
    }

    // Se encontrou um ComponentName { e o nível de brace bate
    const match = lineText.match(/^\s*([A-Z][a-zA-Z]+)\s*\{/);
    if (match && braceDepth <= 0) {
      const name = match[1];
      if (COMPONENT_NAMES.includes(name)) {
        return name;
      }
    }
  }

  return null;
}

// ────────────────────────────────────────────────────────────
// ACTIVATION
// ────────────────────────────────────────────────────────────

// Track the last .ts file the user had open, so we don't lose it when debug steals focus
let _lastActiveTsFile: string | null = null;

function _isValidTsEntry(filePath: string): boolean {
  return (
    filePath.endsWith(".ts") &&
    !filePath.includes("__tests__") &&
    !filePath.includes(".test.") &&
    !filePath.includes(".spec.") &&
    !filePath.includes("node_modules")
  );
}

function _trackActiveEditor(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && _isValidTsEntry(editor.document.uri.fsPath)) {
        _lastActiveTsFile = editor.document.uri.fsPath;
      }
    })
  );
  // Capture current editor immediately on activation
  const current = vscode.window.activeTextEditor;
  if (current && _isValidTsEntry(current.document.uri.fsPath)) {
    _lastActiveTsFile = current.document.uri.fsPath;
  }
}

function detectEntryPoint(workspaceFolder: string): string | null {
  // 1. package.json "main" — only if it's a .ts file
  try {
    const pkgPath = path.join(workspaceFolder, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    if (pkg.main && pkg.main.endsWith(".ts")) {
      const resolved = path.resolve(workspaceFolder, pkg.main);
      if (fs.existsSync(resolved)) return resolved;
    }
  } catch {}

  // 2. Common fixed paths
  for (const rel of ["src/index.ts", "index.ts", "app/index.ts", "src/main.ts", "main.ts"]) {
    const p = path.join(workspaceFolder, rel);
    if (fs.existsSync(p)) return p;
  }

  // 3. Last active editor file tracked before debug stole focus
  if (_lastActiveTsFile && _lastActiveTsFile.startsWith(workspaceFolder) && fs.existsSync(_lastActiveTsFile)) {
    return _lastActiveTsFile;
  }

  // 4. Current active editor (may still work if focus wasn't lost)
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const filePath = editor.document.uri.fsPath;
    if (filePath.startsWith(workspaceFolder) && _isValidTsEntry(filePath)) {
      return filePath;
    }
  }

  return null;
}

/** Async variant: shows a file picker if auto-detection fails */
async function detectEntryPointOrPick(workspaceFolder: string): Promise<string | null> {
  const auto = detectEntryPoint(workspaceFolder);
  if (auto) return auto;

  // Glob for all .ts files under the workspace (excluding node_modules/dist)
  const uris = await vscode.workspace.findFiles(
    "**/*.ts",
    "{**/node_modules/**,**/dist/**,**/__tests__/**,**/*.test.ts,**/*.spec.ts}",
    50
  );

  if (uris.length === 0) return null;

  const items = uris.map((u) => ({
    label: path.relative(workspaceFolder, u.fsPath),
    detail: u.fsPath,
    uri: u,
  }));

  const picked = await vscode.window.showQuickPick(items, {
    title: "Mocha: Select entry point",
    placeHolder: "Choose the .ts file to run",
  });

  return picked?.detail ?? null;
}

function randomPort(): number {
  return 50000 + Math.floor(Math.random() * 10000);
}

export function activate(context: vscode.ExtensionContext): void {
  console.log("Mocha-DS QML IntelliSense ativado!");

  // Track the last active .ts file (so debug focus steal doesn't break entry detection)
  _trackActiveEditor(context);

  // Linguagem alvo
  const QML: vscode.DocumentSelector = { language: "qml" };

  // 1. Completion Provider
  const completionDisposable = vscode.languages.registerCompletionItemProvider(
    QML,
    completionProvider,
    " ", "\n", ".", '"', "'"
  );

  // 2. Hover Provider
  const hoverDisposable = vscode.languages.registerHoverProvider(
    QML,
    hoverProvider
  );

  // 3. Code Actions (auto-import)
  const codeActionDisposable = vscode.languages.registerCodeActionsProvider(
    QML,
    importActionProvider,
    { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
  );

  // 4. QObject Inspector (WebviewView)
  const config = vscode.workspace.getConfiguration("mocha");
  const host = config.get<string>("debugHost") || "localhost";
  const port = config.get<number>("debugPort") || randomPort();
  const { InspectorProvider } = require("./inspector");
  const inspectorProvider = new InspectorProvider(host, port);
  const inspectorDisposable = vscode.window.registerWebviewViewProvider(
    "mocha.inspector",
    inspectorProvider
  );

  // 5. Debug configuration resolver (auto-detect entry point + random port)
  const debugConfigProvider = vscode.debug.registerDebugConfigurationProvider(
    "mocha",
    {
      resolveDebugConfiguration(
        _folder: vscode.WorkspaceFolder | undefined,
        debugConfig: vscode.DebugConfiguration
      ): vscode.ProviderResult<vscode.DebugConfiguration> {
        const wsFolder = _folder?.uri.fsPath || process.cwd();

        if (!debugConfig.type)    debugConfig.type    = "mocha";
        if (!debugConfig.request) debugConfig.request = "launch";
        if (!debugConfig.name)    debugConfig.name    = "Mocha: Debug";
        if (!debugConfig.cwd)     debugConfig.cwd     = wsFolder;
        if (!debugConfig.port)    debugConfig.port    = randomPort();

        if (!debugConfig.program) {
          // Use async pick — return a Promise so VS Code awaits it
          return detectEntryPointOrPick(wsFolder).then((entry) => {
            if (!entry) {
              vscode.window.showErrorMessage("Mocha: No entry point selected. Open a .ts file and try again.");
              return undefined;
            }
            debugConfig.program = entry;
            return debugConfig;
          });
        }

        return debugConfig;
      }
    }
  );

  // 6. Commands
  const runCmd = vscode.commands.registerCommand("mocha.run", async () => {
    const ws = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!ws) { vscode.window.showErrorMessage("No workspace folder open"); return; }
    const entry = await detectEntryPointOrPick(ws);
    if (!entry) { vscode.window.showErrorMessage("No entry point selected."); return; }
    const port = randomPort();
    const terminal = vscode.window.createTerminal("Mocha Dev");
    terminal.sendText(`MOCHA_DEVTOOLS=1 MOCHA_DEVTOOLS_PORT=${port} npx tsx "${entry}"`);
    terminal.show();
  });

  const inspectCmd = vscode.commands.registerCommand("mocha.inspect", async () => {
    vscode.commands.executeCommand("mocha.inspector.focus");
  });

  context.subscriptions.push(
    completionDisposable,
    hoverDisposable,
    codeActionDisposable,
    inspectorDisposable,
    debugConfigProvider,
    runCmd,
    inspectCmd
  );
}

export function deactivate(): void {
  console.log("Mocha Framework desativado.");
}
