# Mocha-DS QML IntelliSense — VS Code Extension

Extensão do VS Code com **autocomplete**, **hover docs** e **snippets** para o design system Mocha-DS em QML (`.qml` e `.qml.ts`).

---

## ✨ Funcionalidades

| Feature | Descrição |
|---|---|
| **Autocomplete de Componentes** | Digite `Button`, `Modal`, `CozyList`... e receba sugestão do bloco completo com props obrigatórias |
| **Autocomplete de Props** | Dentro de qualquer bloco `Card { }`, `Modal { }` etc., receba todas as props com valores aceitos |
| **Enum Choices** | Props com valores fixos (`variant: "primary\|secondary\|..."`) viram escolhas inline |
| **Hover Documentation** | Passe o mouse sobre qualquer componente MochaDS e veja a documentação completa |
| **Theme Token Autocomplete** | `Theme.colors.`, `Theme.spacing.`, `Theme.typography.`, `Theme.geometry.` com todos os tokens |
| **Signal Handlers** | Sugestões de `onClicked`, `onToggled`, `onValueChanged` etc. com snippet de função |
| **Quick Fix: Auto-import** | Detecta componentes MochaDS sem import e oferece adicionar automaticamente |
| **50+ Snippets** | Prefixes como `mds-button`, `mds-modal`, `mds-sidebar`, `mds-list` etc. |

---

## 📁 Estrutura

```
vscode-extension/
├── src/
│   ├── extension.ts      # Entry point, registra os providers
│   └── componentData.ts  # Database de componentes, props e docs
├── snippets/
│   └── snippets.json     # 50+ snippets declarativos
├── package.json          # Manifesto da extensão
├── tsconfig.json
└── language-configuration.json
```

---

## 🚀 Como testar localmente (Dev Host)

### Pré-requisitos

```bash
# Instale as dependências
cd vscode-extension
npm install

# Compile o TypeScript
npm run compile
```

### Rodando em modo de desenvolvimento

1. Abra a pasta `vscode-extension/` no VS Code
2. Pressione **`F5`** (ou `Run > Start Debugging`)
3. Uma nova janela do VS Code abre — **Extension Development Host**
4. Abra qualquer arquivo `.qml` ou `.qml.ts` do projeto
5. Digite `Button` ou `Modal` e veja o autocomplete aparecer

### Atalhos úteis durante o desenvolvimento

| Ação | Atalho |
|---|---|
| Recarregar a extensão após mudanças | `Ctrl+Shift+P → Developer: Reload Window` |
| Ver logs da extensão | `Ctrl+Shift+U → selecionar "Mocha-DS"` |
| Testar snippet | Digite o prefixo `mds-button` e pressione `Tab` |
| Forçar autocomplete | `Ctrl+Space` |

---

## 📦 Publicar (opcional)

```bash
npm install -g @vscode/vsce
vsce package          # gera .vsix
vsce publish          # publica no marketplace
```

---

## ⚙️ Configurações

Adicione ao seu `settings.json`:

```json
{
  // Alias padrão ao importar MochaDS nos arquivos de playground
  "mochads.importAlias": "DS",

  // "relative" = import ".." as DS
  // "module"   = import MochaDS 1.0
  "mochads.moduleStyle": "relative"
}
```

---

## 🧩 Componentes suportados

| Categoria | Componentes |
|---|---|
| **Ações** | Button, ButtonGroup, ButtonGroupItem, ToggleButton |
| **Inputs** | TextField, Checkbox, Switch, RadioButton, RadioGroup, Select, AdvancedSelect, Slider, PinInput, DatePicker, ColorPicker, CozyColorPicker |
| **Feedback** | Badge, Toast, ToastManager, ProgressBar, CozySpinner, CozySkeleton, EmptyState |
| **Overlay** | Modal, Drawer, AlertDialog, Tooltip, ContextMenu, Dropdown |
| **Layout** | Card, Accordion, Tabs, Separator, HStack, VStack, CozyGrid, CozyGridCol, CozyList, Div |
| **Navegação** | Sidebar, SidebarItem, NavigationBar, Breadcrumb, Router, Route, RouterLink |
| **Dados** | Paginator, Avatar, Tag |
| **Texto** | TextEditor, FormField, DynamicForm, Form |
| **Drag & Drop** | Draggable, DropZone |
| **Animações** | FadeIn, SlideUp, AnimatedPresence, AnimatedNumber, Div, Transition, Animation |
| **Fluxo** | Switcher, Case |
| **Singletons** | Theme (6 flavors: mocha, macchiato, frappe, latte, vercel, vercel-light), MochaI18n, LucideIcon, Pipes |

---

## 🗺️ Roadmap

- [ ] Suporte a definição "Go to Definition" para componentes
- [ ] Diagnósticos de props inválidas (valores não permitidos no enum)
- [ ] CLDR pluralização no autocomplete do `MochaI18n.t()`
- [ ] Completions para nomes de ícones Lucide (1962 ícones)
- [ ] Color picker inline para `Theme.colors.*`
