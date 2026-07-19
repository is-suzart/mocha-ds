#!/usr/bin/env node
// ============================================================
// scripts/sync-docs.mjs
//
// Fonte única de verdade para metadados dos componentes.
// Gera automaticamente:
//   1. vscode-extension/src/componentData.ts  (IntelliSense)
//   2. .ai/knowledge/components.md            (knowledge base)
//
// USO:
//   node scripts/sync-docs.mjs
//
// Execute sempre que adicionar/modificar um componente.
// ============================================================

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ============================================================
// FONTE DE VERDADE — edite aqui para atualizar tudo
// ============================================================

/** @type {import('../vscode-extension/src/componentData').ComponentDefinition[]} */
const COMPONENTS = [

  // ──────────────────────────────────────────────────────────
  // AÇÕES
  // ──────────────────────────────────────────────────────────
  {
    name: "Button",
    category: "Ações",
    description: "Botão de ação com suporte a variantes, ícones, estados de loading e micro-animações de press/hover.",
    props: [
      { name: "text",          type: "string", default: '""',         description: "Rótulo visível do botão" },
      { name: "variant",       type: "string", default: '"primary"',  values: ["primary","secondary","danger","success","warning","info","outline","tonal","ghost","filled"], description: "Estilo visual" },
      { name: "color",         type: "string", default: '"mauve"',    values: ["mauve","lavender","blue","sapphire","sky","teal","green","yellow","peach","maroon","red","pink","flamingo","rosewater","surface0"], description: "Cor de accent (14 cores Catppuccin)" },
      { name: "size",          type: "string", default: '"md"',       values: ["sm","md","lg"], description: "sm=32px, md=40px, lg=48px" },
      { name: "shape",         type: "string", default: '"rounded"',  values: ["square","rounded","pill"], description: "Formato dos cantos" },
      { name: "disabled",      type: "bool",   default: "false",      description: "Desabilita o botão" },
      { name: "isLoading",     type: "bool",   default: "false",      description: "Exibe spinner de carregamento" },
      { name: "leftIcon",      type: "string", default: '""',         description: "Ícone Lucide à esquerda" },
      { name: "rightIcon",     type: "string", default: '""',         description: "Ícone Lucide à direita" },
      { name: "customRadius",  type: "real",   default: "-1",         description: "Raio de borda customizado" },
      { name: "customColor",   type: "color",  default: "transparent", description: "Cor de fundo customizada" },
      { name: "customTextColor", type: "color", default: "transparent", description: "Cor do texto customizada" },
    ],
    signals: [{ name: "clicked", description: "Emitido ao clicar no botão" }],
    slots: ["customContent (default)"],
    example: `Button {
    text: "Salvar"
    variant: "primary"
    leftIcon: "save"
    onClicked: console.log("salvo!")
}`,
  },

  {
    name: "ButtonGroup",
    category: "Ações",
    description: "Agrupa ButtonGroupItems com indicador deslizante animado.",
    props: [
      { name: "currentIndex", type: "int",    default: "0",         description: "Índice do item ativo" },
      { name: "variant",      type: "string", default: '"default"', values: ["default","primary"], description: "Estilo do grupo" },
      { name: "expand",       type: "bool",   default: "true",      description: "Distribui largura igualmente" },
    ],
    slots: ["content (default) — ButtonGroupItems"],
    example: `ButtonGroup {
    currentIndex: 0
    ButtonGroupItem { text: "Dia" }
    ButtonGroupItem { text: "Semana" }
    ButtonGroupItem { text: "Mês" }
}`,
  },

  {
    name: "ButtonGroupItem",
    category: "Ações",
    description: "Item individual para uso dentro de ButtonGroup.",
    props: [
      { name: "text",      type: "string", default: '""', description: "Texto" },
      { name: "iconName",  type: "string", default: '""', description: "Ícone Lucide" },
      { name: "badgeText", type: "string", default: '""', description: "Badge numérico" },
    ],
    signals: [{ name: "clicked", description: "Clicado" }],
    example: `ButtonGroupItem { text: "Opção A" }`,
  },

  {
    name: "ToggleButton",
    category: "Ações",
    description: "Botão que alterna entre estado ativo/inativo.",
    props: [
      { name: "checked",  type: "bool",   default: "false", description: "Estado atual" },
      { name: "label",    type: "string", default: '""',    description: "Label" },
      { name: "disabled", type: "bool",   default: "false", description: "Desabilita" },
    ],
    signals: [{ name: "toggled", params: "bool state", description: "Estado mudou" }],
    example: `ToggleButton { label: "Favorito"; onToggled: function(s) { isFav = s } }`,
  },

  // ──────────────────────────────────────────────────────────
  // INPUTS
  // ──────────────────────────────────────────────────────────
  {
    name: "TextField",
    category: "Inputs",
    description: "Campo de texto com ícones, validação, tipos e toggle de senha.",
    props: [
      { name: "text",                  type: "string", default: '""',       description: "Valor atual" },
      { name: "placeholder",           type: "string", default: '""',       description: "Placeholder" },
      { name: "type",                  type: "string", default: '"text"',   values: ["text","password","email","number"], description: "Tipo" },
      { name: "iconLeft",              type: "string", default: '""',       description: "Ícone Lucide à esquerda" },
      { name: "iconRight",             type: "string", default: '""',       description: "Ícone Lucide à direita" },
      { name: "status",                type: "string", default: '"normal"', values: ["normal","success","error"], description: "Estado de validação" },
      { name: "disabled",              type: "bool",   default: "false",    description: "Desabilita" },
      { name: "readOnly",              type: "bool",   default: "false",    description: "Somente leitura" },
      { name: "size",                  type: "string", default: '"md"',     values: ["sm","md","lg"], description: "Tamanho" },
      { name: "errorText",             type: "string", default: '""',       description: "Mensagem de erro (ativa shake)" },
      { name: "customRadius",          type: "real",   default: "-1",       description: "Raio customizado" },
      { name: "customBorderColor",     type: "color",  default: "transparent", description: "Borda customizada" },
      { name: "customBackgroundColor", type: "color",  default: "transparent", description: "Fundo customizado" },
    ],
    signals: [
      { name: "accepted",   description: "Enter pressionado" },
      { name: "textEdited", description: "Texto modificado" },
    ],
    example: `TextField {
    placeholder: "Digite seu e-mail"
    type: "email"
    iconLeft: "mail"
    onTextEdited: console.log(text)
}`,
  },

  {
    name: "Checkbox",
    category: "Inputs",
    description: "Checkbox com checkmark animado.",
    props: [
      { name: "checked",  type: "bool",   default: "false", description: "Estado marcado" },
      { name: "label",    type: "string", default: '""',    description: "Label" },
      { name: "disabled", type: "bool",   default: "false", description: "Desabilita" },
    ],
    signals: [{ name: "toggled", params: "bool isChecked", description: "Estado mudou" }],
    example: `Checkbox { label: "Aceito os termos"; onToggled: function(c) { ok = c } }`,
  },

  {
    name: "Switch",
    category: "Inputs",
    description: "Toggle switch animado com label.",
    props: [
      { name: "checked",  type: "bool",   default: "false", description: "Estado" },
      { name: "disabled", type: "bool",   default: "false", description: "Desabilita" },
      { name: "size",     type: "string", default: '"md"',  values: ["sm","md","lg"], description: "sm=36x20, md=44x24, lg=56x32" },
      { name: "label",    type: "string", default: '""',    description: "Label" },
    ],
    signals: [{ name: "toggled", params: "bool checked", description: "Estado mudou" }],
    example: `Switch { label: "Modo escuro"; onToggled: function(on) { Theme.flavor = on ? "mocha" : "latte" } }`,
  },

  {
    name: "RadioButton",
    category: "Inputs",
    description: "Radio button individual. Use dentro de RadioGroup.",
    props: [
      { name: "label",    type: "string", default: '""',    description: "Texto" },
      { name: "value",    type: "string", default: '""',    description: "Valor" },
      { name: "size",     type: "string", default: '"md"',  values: ["sm","md","lg"], description: "sm=14px, md=18px, lg=22px" },
      { name: "checked",  type: "bool",   default: "false", description: "Estado" },
      { name: "disabled", type: "bool",   default: "false", description: "Desabilita" },
    ],
    signals: [{ name: "clicked", description: "Clicado" }],
    example: `RadioButton { label: "Opção A"; value: "a" }`,
  },

  {
    name: "RadioGroup",
    category: "Inputs",
    description: "Gerencia seleção mutuamente exclusiva de RadioButtons.",
    props: [
      { name: "selectedValue", type: "string", default: '""',         description: "Valor selecionado" },
      { name: "direction",     type: "string", default: '"vertical"', values: ["vertical","horizontal"], description: "Direção" },
      { name: "spacing",       type: "real",   default: "Theme.spacing.md", description: "Espaço entre radios" },
    ],
    slots: ["content (default)"],
    methods: ["select(value)", "selectByIndex(index)"],
    example: `RadioGroup {
    selectedValue: "b"
    RadioButton { label: "Opção A"; value: "a" }
    RadioButton { label: "Opção B"; value: "b" }
}`,
  },

  {
    name: "Select",
    category: "Inputs",
    description: "Dropdown com smart flip e overlay de clique externo.",
    props: [
      { name: "options",       type: "var",    default: "[]",             description: "Array de strings ou [{value, label}]" },
      { name: "selectedValue", type: "var",    default: "null",           description: "Valor selecionado" },
      { name: "placeholder",   type: "string", default: '"Selecione..."', description: "Placeholder" },
      { name: "disabled",      type: "bool",   default: "false",          description: "Desabilita" },
      { name: "size",          type: "string", default: '"md"',           values: ["sm","md","lg"], description: "Tamanho" },
      { name: "status",        type: "string", default: '"normal"',       values: ["normal","success","error"], description: "Estado" },
      { name: "expanded",      type: "bool",   default: "false",          description: "Forçar aberto" },
      { name: "openUpward",    type: "bool",   default: "false",          description: "Abre para cima" },
    ],
    signals: [{ name: "valueChanged", params: "var val", description: "Seleção mudou" }],
    example: `Select {
    options: ["Jan", "Fev", "Mar"]
    placeholder: "Selecione o mês"
    onValueChanged: function(val) { console.log(val) }
}`,
  },

  {
    name: "AdvancedSelect",
    category: "Inputs",
    description: "Select com busca, multi-seleção e tags removíveis.",
    props: [
      { name: "options",        type: "var",    default: "[]",             description: "Opções" },
      { name: "selectedValues", type: "var",    default: "[]",             description: "Valores selecionados (multi)" },
      { name: "placeholder",    type: "string", default: '"Selecione..."', description: "Placeholder" },
      { name: "disabled",       type: "bool",   default: "false",          description: "Desabilita" },
      { name: "searchable",     type: "bool",   default: "true",           description: "Habilita busca" },
      { name: "multiple",       type: "bool",   default: "true",           description: "Permite múltipla seleção" },
      { name: "size",           type: "string", default: '"md"',           values: ["sm","md","lg"], description: "Tamanho" },
      { name: "status",         type: "string", default: '"normal"',       values: ["normal","success","error"], description: "Estado" },
    ],
    signals: [{ name: "selectionChanged", params: "var vals", description: "Seleção mudou" }],
    example: `AdvancedSelect {
    options: ["React", "Vue", "QML"]
    multiple: true
    searchable: true
    onSelectionChanged: function(vals) { console.log(vals) }
}`,
  },

  {
    name: "Slider",
    category: "Inputs",
    description: "Slider numérico com trilha animada.",
    props: [
      { name: "value",    type: "real",   default: "0",     description: "Valor atual" },
      { name: "minimum",  type: "real",   default: "0",     description: "Mínimo" },
      { name: "maximum",  type: "real",   default: "100",   description: "Máximo" },
      { name: "step",     type: "real",   default: "1",     description: "Incremento" },
      { name: "disabled", type: "bool",   default: "false", description: "Desabilita" },
      { name: "size",     type: "string", default: '"md"',  values: ["sm","md","lg"], description: "Espessura: sm=4px, md=6px, lg=8px" },
    ],
    example: `Slider { minimum: 0; maximum: 100; value: 50 }`,
  },

  {
    name: "PinInput",
    category: "Inputs",
    description: "Input de PIN/OTP com N slots, auto-advance e máscara.",
    props: [
      { name: "length",   type: "int",    default: "4",        description: "Número de slots" },
      { name: "text",     type: "string", default: '""',       description: "Valor atual" },
      { name: "type",     type: "string", default: '"number"', values: ["number","text"], description: "Tipo" },
      { name: "mask",     type: "bool",   default: "false",    description: "Máscara (bullets)" },
      { name: "status",   type: "string", default: '"normal"', values: ["normal","success","error"], description: "Estado" },
      { name: "disabled", type: "bool",   default: "false",    description: "Desabilita" },
      { name: "size",     type: "string", default: '"md"',     values: ["sm","md","lg"], description: "Tamanho" },
    ],
    signals: [
      { name: "completed", params: "string code", description: "Todos os slots preenchidos" },
      { name: "accepted",  description: "Enter pressionado" },
    ],
    methods: ["clear()", "forceFocus()"],
    example: `PinInput { length: 6; mask: true; onCompleted: function(code) { verifyOtp(code) } }`,
  },

  {
    name: "DatePicker",
    category: "Inputs",
    description: "Calendário completo com navegação por mês.",
    props: [
      { name: "selectedDate", type: "var",    default: "null",           description: "Objeto Date" },
      { name: "placeholder",  type: "string", default: '"Selecione..."', description: "Placeholder" },
      { name: "format",       type: "string", default: '"dd/MM/yyyy"',   description: "Formato de exibição" },
      { name: "disabled",     type: "bool",   default: "false",          description: "Desabilita" },
      { name: "size",         type: "string", default: '"md"',           values: ["sm","md","lg"], description: "Tamanho" },
      { name: "expanded",     type: "bool",   default: "false",          description: "Forçar aberto" },
      { name: "openUpward",   type: "bool",   default: "false",          description: "Abre para cima" },
    ],
    example: `DatePicker { format: "dd/MM/yyyy"; placeholder: "Selecione a data" }`,
  },

  {
    name: "ColorPicker",
    category: "Inputs",
    description: "Seletor de cor com 14 presets Catppuccin e entrada HEX.",
    props: [
      { name: "selectedColor", type: "color",  default: "Theme.colors.mauve", description: "Cor selecionada" },
      { name: "placeholder",   type: "string", default: '""',                 description: "Placeholder" },
      { name: "disabled",      type: "bool",   default: "false",              description: "Desabilita" },
      { name: "size",          type: "string", default: '"md"',               values: ["sm","md","lg"], description: "Tamanho" },
      { name: "expanded",      type: "bool",   default: "false",              description: "Forçar aberto" },
    ],
    example: `ColorPicker { selectedColor: Theme.colors.mauve }`,
  },

  {
    name: "CozyColorPicker",
    category: "Inputs",
    description: "Color picker HSV completo (saturação/valor + hue slider).",
    props: [
      { name: "colorValue", type: "string", default: '"#CBA6F7"', description: "Cor em HEX" },
      { name: "inline",     type: "bool",   default: "false",     description: "Modo inline" },
      { name: "disabled",   type: "bool",   default: "false",     description: "Desabilita" },
      { name: "expanded",   type: "bool",   default: "false",     description: "Forçar aberto" },
    ],
    signals: [{ name: "colorChanged", params: "string newHex", description: "Cor mudou" }],
    example: `CozyColorPicker { colorValue: "#89B4FA"; onColorChanged: function(hex) { myColor = hex } }`,
  },

  // ──────────────────────────────────────────────────────────
  // FEEDBACK
  // ──────────────────────────────────────────────────────────
  {
    name: "Badge",
    category: "Feedback",
    description: "Badge/tag com variantes, cores, formas e dismiss.",
    props: [
      { name: "text",          type: "string", default: '""',       description: "Texto" },
      { name: "variant",       type: "string", default: '"filled"', values: ["filled","tonal","outline","flat"], description: "Estilo visual" },
      { name: "color",         type: "string", default: '"mauve"',  values: ["mauve","lavender","blue","sapphire","sky","teal","green","yellow","peach","maroon","red","pink","flamingo","rosewater"], description: "Cor de accent" },
      { name: "size",          type: "string", default: '"md"',     values: ["sm","md","lg"], description: "sm=20px, md=24px, lg=32px" },
      { name: "shape",         type: "string", default: '"pill"',   values: ["square","rounded","pill"], description: "Formato" },
      { name: "icon",          type: "string", default: '""',       description: "Ícone Lucide" },
      { name: "isDismissible", type: "bool",   default: "false",    description: "Mostra X de dismiss" },
      { name: "showDot",       type: "bool",   default: "false",    description: "Dot indicador" },
    ],
    signals: [{ name: "dismissed", description: "Dispensado" }],
    example: `Badge { text: "Novo"; color: "green"; variant: "tonal" }`,
  },

  {
    name: "Toast",
    category: "Feedback",
    description: "Notificação temporária com barra de progresso e slide animado.",
    props: [
      { name: "title",     type: "string", default: '""',     description: "Título" },
      { name: "message",   type: "string", default: '""',     description: "Mensagem" },
      { name: "type",      type: "string", default: '"info"', values: ["info","success","warning","error"], description: "Tipo" },
      { name: "duration",  type: "int",    default: "3000",   description: "Auto-dismiss em ms" },
      { name: "showClose", type: "bool",   default: "true",   description: "Botão X" },
    ],
    signals: [{ name: "dismissed", description: "Dispensado" }],
    example: `Toast { type: "success"; title: "Salvo!"; message: "Alterações salvas." }`,
  },

  {
    name: "ToastManager",
    category: "Feedback",
    description: "Gerenciador de fila de toasts. Posicione na raiz da aplicação.",
    props: [
      { name: "position", type: "string", default: '"top-right"', values: ["top-right","top-left","bottom-right","bottom-left"], description: "Posição" },
    ],
    methods: ["show(msg, type, title?, dur?)", "success(msg, title?)", "error(msg, title?)", "warning(msg, title?)", "info(msg, title?)"],
    example: `// Na raiz:
ToastManager { id: toasts }
// Em qualquer lugar:
toasts.success("Salvo!")`,
  },

  {
    name: "ProgressBar",
    category: "Feedback",
    description: "Barra de progresso com modo indeterminado e label de %.",
    props: [
      { name: "value",         type: "real",   default: "0.0",       description: "0.0 a 1.0" },
      { name: "variant",       type: "string", default: '"primary"', values: ["primary","success","warning","danger","info","peach","mauve"], description: "Cor" },
      { name: "showLabel",     type: "bool",   default: "false",     description: "Exibe %" },
      { name: "indeterminate", type: "bool",   default: "false",     description: "Modo animado" },
      { name: "customColor",   type: "color",  default: "transparent", description: "Cor customizada" },
      { name: "customHeight",  type: "real",   default: "8",         description: "Altura em px" },
    ],
    example: `ProgressBar { value: 0.75; variant: "success"; showLabel: true }`,
  },

  {
    name: "CozySpinner",
    category: "Feedback",
    description: "Spinner de carregamento com modo overlay de tela cheia.",
    props: [
      { name: "size",         type: "real",   default: "24",                   description: "Tamanho em px" },
      { name: "color",        type: "color",  default: "Theme.colors.primary", description: "Cor" },
      { name: "overlay",      type: "bool",   default: "false",                description: "Modo tela cheia" },
      { name: "label",        type: "string", default: '""',                   description: "Texto (apenas overlay)" },
      { name: "overlayColor", type: "color",  default: "crust @ 85%",          description: "Cor do backdrop" },
    ],
    example: `CozySpinner { size: 32; overlay: true; label: "Carregando..."; visible: isLoading }`,
  },

  {
    name: "CozySkeleton",
    category: "Feedback",
    description: "Placeholder de carregamento com shimmer animado.",
    props: [
      { name: "variant", type: "string", default: '"rectangle"', values: ["rectangle","circle"], description: "Formato" },
      { name: "radius",  type: "real",   default: "(auto)",      description: "Raio customizado" },
    ],
    example: `CozySkeleton { variant: "circle"; width: 48; height: 48 }`,
  },

  {
    name: "EmptyState",
    category: "Feedback",
    description: "Estado vazio com ícone, título e descrição.",
    props: [
      { name: "icon",        type: "string", default: '"inbox"',           description: "Ícone Lucide" },
      { name: "title",       type: "string", default: '"Nenhum registro"', description: "Título" },
      { name: "description", type: "string", default: '""',               description: "Descrição" },
      { name: "size",        type: "string", default: '"md"',             values: ["sm","md","lg"], description: "Tamanho" },
    ],
    example: `EmptyState { icon: "package-open"; title: "Vazio"; description: "Ajuste os filtros" }`,
  },

  // ──────────────────────────────────────────────────────────
  // OVERLAY
  // ──────────────────────────────────────────────────────────
  {
    name: "Modal",
    category: "Overlay",
    description: "Modal centralizado com backdrop, escala+opacity animada e portal.",
    props: [
      { name: "open",                 type: "bool",   default: "false",  required: true, description: "Controla visibilidade" },
      { name: "title",                type: "string", default: '""',                     description: "Título" },
      { name: "subtitle",             type: "string", default: '""',                     description: "Subtítulo" },
      { name: "size",                 type: "string", default: '"md"',   values: ["sm","md","lg","full"], description: "sm=400px, md=600px, lg=800px" },
      { name: "customWidth",          type: "real",   default: "-1",                     description: "Largura customizada" },
      { name: "customHeight",         type: "real",   default: "-1",                     description: "Altura customizada" },
      { name: "closeOnBackdropClick", type: "bool",   default: "true",                   description: "Fecha no backdrop" },
      { name: "closeOnEscape",        type: "bool",   default: "true",                   description: "Fecha com Esc" },
      { name: "showCloseButton",      type: "bool",   default: "true",                   description: "Botão X" },
      { name: "usePortal",            type: "bool",   default: "true",                   description: "Hoist para janela raiz" },
    ],
    signals: [
      { name: "accepted", description: "Confirmado" },
      { name: "rejected", description: "Cancelado/fechado" },
      { name: "opened",   description: "Abriu" },
      { name: "closed",   description: "Fechou" },
    ],
    slots: ["content (default)", "footer"],
    example: `Modal {
    open: showModal
    title: "Confirmar"
    size: "sm"
    onRejected: showModal = false
    Text { text: "Tem certeza?" }
    footer: Button { text: "OK"; variant: "primary"; onClicked: { accepted(); showModal = false } }
}`,
  },

  {
    name: "Drawer",
    category: "Overlay",
    description: "Painel deslizante lateral/superior/inferior com backdrop e portal.",
    props: [
      { name: "open",                 type: "bool",   default: "false",  required: true,   description: "Controla visibilidade" },
      { name: "title",                type: "string", default: '""',                       description: "Título" },
      { name: "subtitle",             type: "string", default: '""',                       description: "Subtítulo" },
      { name: "position",             type: "string", default: '"right"', values: ["right","left","top","bottom"], description: "Posição" },
      { name: "size",                 type: "real",   default: "360",                      description: "Largura ou altura em px" },
      { name: "closeOnBackdropClick", type: "bool",   default: "true",                     description: "Fecha no backdrop" },
      { name: "closeOnEscape",        type: "bool",   default: "true",                     description: "Fecha com Esc" },
      { name: "showCloseButton",      type: "bool",   default: "true",                     description: "Botão X" },
      { name: "usePortal",            type: "bool",   default: "true",                     description: "Hoist para janela raiz" },
      { name: "customRadius",         type: "real",   default: "-1",                       description: "Raio customizado" },
    ],
    signals: [
      { name: "opened", description: "Abriu" },
      { name: "closed", description: "Fechou" },
    ],
    example: `Drawer {
    open: showFilter
    title: "Filtros"
    position: "right"
    size: 400
    onClosed: showFilter = false
}`,
  },

  {
    name: "AlertDialog",
    category: "Overlay",
    description: "Dialog de confirmação pré-configurado com tipos info/success/warning/error.",
    props: [
      { name: "open",          type: "bool",   default: "false",      required: true, description: "Visibilidade" },
      { name: "dialogType",    type: "string", default: '"info"',     values: ["info","success","warning","error"], description: "Tipo" },
      { name: "dialogTitle",   type: "string", default: '""',         description: "Título" },
      { name: "dialogMessage", type: "string", default: '""',         description: "Mensagem" },
      { name: "confirmLabel",  type: "string", default: '"Confirmar"', description: "Label confirmar" },
      { name: "cancelLabel",   type: "string", default: '"Cancelar"',  description: "Label cancelar" },
      { name: "showCancel",    type: "bool",   default: "true",        description: "Exibe cancelar" },
    ],
    signals: [
      { name: "confirmed", description: "Confirmou" },
      { name: "cancelled", description: "Cancelou" },
    ],
    example: `AlertDialog {
    open: showDelete
    dialogType: "error"
    dialogTitle: "Excluir?"
    onConfirmed: deleteItem()
    onCancelled: showDelete = false
}`,
  },

  {
    name: "Tooltip",
    category: "Overlay",
    description: "Tooltip com smart flip, caret e delay.",
    props: [
      { name: "text",      type: "string", default: '""',    description: "Texto" },
      { name: "placement", type: "string", default: '"top"', values: ["top","bottom","left","right"], description: "Posição preferida" },
      { name: "delay",     type: "int",    default: "500",   description: "Delay em ms" },
      { name: "maxWidth",  type: "real",   default: "240",   description: "Largura máxima" },
    ],
    example: `Button { text: "Salvar"; Tooltip { text: "Ctrl+S" } }`,
  },

  {
    name: "ContextMenu",
    category: "Overlay",
    description: "Menu de contexto com ícones, atalhos e separadores.",
    props: [
      { name: "items",   type: "var",  default: "[]",   description: "[{label, icon, shortcut, separator, onClicked}]" },
      { name: "open",    type: "bool", default: "false", description: "Visibilidade" },
      { name: "offsetX", type: "real", default: "0",     description: "Deslocamento X" },
      { name: "offsetY", type: "real", default: "0",     description: "Deslocamento Y" },
    ],
    signals: [{ name: "closed", description: "Fechado" }],
    methods: ["showAt(x, y)", "dismiss()"],
    example: `ContextMenu { id: ctx; items: [{ label: "Editar", icon: "pencil", onClicked: function() { edit() } }] }`,
  },

  {
    name: "Dropdown",
    category: "Overlay",
    description: "Menu dropdown com smart flip e animação.",
    props: [
      { name: "items",     type: "var",    default: "[]",             description: "[{label, icon, shortcut, variant, disabled, separator, onClicked, keepOpen}]" },
      { name: "placement", type: "string", default: '"bottom-start"', values: ["bottom-start","bottom-end","top-start","top-end"], description: "Posicionamento" },
      { name: "minWidth",  type: "real",   default: "180",            description: "Largura mínima" },
      { name: "isOpen",    type: "bool",   default: "false",          description: "Visibilidade" },
    ],
    signals: [{ name: "itemSelected", params: "var item", description: "Item selecionado" }],
    methods: ["toggle(triggerItem)", "open(triggerItem)", "close()"],
    example: `Button { id: btn; text: "Ações ▾"; onClicked: menu.toggle(btn) }
Dropdown { id: menu; items: [{ label: "Exportar", icon: "download", onClicked: function() { exportData() } }] }`,
  },

  // ──────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────
  {
    name: "Card",
    category: "Layout",
    description: "Container com header, body e footer. Variantes, ícones, separadores e modo clicável.",
    props: [
      { name: "title",           type: "string", default: '""',        description: "Título do header" },
      { name: "subtitle",        type: "string", default: '""',        description: "Subtítulo" },
      { name: "icon",            type: "string", default: '""',        description: "Ícone Lucide" },
      { name: "variant",         type: "string", default: '"default"', values: ["default","accent","tonal","outline","filled"], description: "Estilo visual" },
      { name: "accentPosition",  type: "string", default: '"left"',    values: ["left","top","none"], description: "Posição do accent" },
      { name: "clickable",       type: "bool",   default: "false",     description: "Hover/press com micro-animação" },
      { name: "padding",         type: "real",   default: "Theme.spacing.lg", description: "Padding do body" },
      { name: "backgroundColor", type: "string", default: '""',        description: "Cor Catppuccin (variant=filled)" },
      { name: "headerSeparator", type: "bool",   default: "true",      description: "Separador após header" },
      { name: "footerSeparator", type: "bool",   default: "true",      description: "Separador antes do footer" },
      { name: "customRadius",    type: "real",   default: "-1",        description: "Raio customizado" },
    ],
    signals: [{ name: "clicked", description: "Card clicado (clickable=true)" }],
    slots: ["header: list<Item>", "footer: list<Item>", "content (default)"],
    example: `Card {
    title: "Resumo"
    variant: "accent"
    Text { text: "R$ 12.450" }
    footer: [HStack { Button { text: "Ver mais"; variant: "ghost" } }]
}`,
  },

  {
    name: "Accordion",
    category: "Layout",
    description: "Painel expansível com animação suave de altura.",
    props: [
      { name: "title",       type: "string", default: '""',        description: "Título" },
      { name: "icon",        type: "string", default: '""',        description: "Ícone Lucide" },
      { name: "expanded",    type: "bool",   default: "false",     description: "Estado expandido" },
      { name: "variant",     type: "string", default: '"default"', values: ["default","outline","tonal","split","filled"], description: "Estilo" },
      { name: "interactive", type: "bool",   default: "true",      description: "Habilita interação" },
      { name: "accentColor", type: "string", default: '"mauve"',   description: "Cor do accent" },
    ],
    signals: [{ name: "toggled", params: "bool isExpanded", description: "Estado mudou" }],
    slots: ["content (default)"],
    example: `Accordion { title: "Detalhes"; Text { text: "Conteúdo oculto" } }`,
  },

  {
    name: "Tabs",
    category: "Layout",
    description: "Abas com indicador animado, scroll horizontal, suporte a ícones e reordenação por D&D.",
    props: [
      { name: "model",        type: "var",    default: "[]",     description: "Strings ou [{id, label, icon}]" },
      { name: "currentIndex", type: "int",    default: "0",      description: "Aba ativa" },
      { name: "variant",      type: "string", default: '"line"', values: ["line","pill","segmented","card"], description: "Estilo" },
      { name: "sortable",     type: "bool",   default: "false",  description: "Habilita reordenação por drag & drop" },
    ],
    signals: [
      { name: "tabSelected",   params: "int index, string tabId", description: "Aba selecionada" },
      { name: "tabsReordered", params: "int fromIndex, int toIndex", description: "Emitido ao reordenar abas via drag & drop" }
    ],
    example: `Tabs {
    model: ["Design", "Código", "Deploy"]
    variant: "pill"
    sortable: true
    onTabsReordered: function(from, to) {
        // Atualize a lista no seu model para aplicar a reordenação
    }
}`,
  },

  {
    name: "Separator",
    category: "Layout",
    description: "Linha divisória horizontal ou vertical.",
    props: [
      { name: "orientation", type: "string", default: '"horizontal"', values: ["horizontal","vertical"], description: "Direção" },
      { name: "variant",     type: "string", default: '"default"',    values: ["default","accent","subtle"], description: "Estilo" },
      { name: "thickness",   type: "real",   default: "1",            description: "Espessura em px" },
      { name: "margin",      type: "real",   default: "0",            description: "Margem" },
    ],
    example: `Separator { variant: "accent" }`,
  },

  {
    name: "HStack",
    category: "Layout",
    description: "Layout horizontal com espaçamento configurável.",
    props: [
      { name: "spacing", type: "real", default: "Theme.spacing.md", description: "Espaço entre filhos" },
      { name: "padding", type: "real", default: "0",               description: "Padding interno" },
    ],
    slots: ["content (default)"],
    example: `HStack { spacing: Theme.spacing.sm; Button { text: "A" }; Button { text: "B" } }`,
  },

  {
    name: "VStack",
    category: "Layout",
    description: "Layout vertical com espaçamento configurável.",
    props: [
      { name: "spacing", type: "real", default: "Theme.spacing.md", description: "Espaço entre filhos" },
      { name: "padding", type: "real", default: "0",               description: "Padding interno" },
    ],
    slots: ["content (default)"],
    example: `VStack { spacing: Theme.spacing.lg; Text { text: "L1" }; Text { text: "L2" } }`,
  },

  {
    name: "CozyGrid",
    category: "Layout",
    description: "Grid de 12 colunas com responsividade. Use CozyGridCol para spans.",
    props: [
      { name: "mobile",    type: "bool",   default: "false",   description: "Colapsa em 1 coluna no mobile" },
      { name: "multiline", type: "bool",   default: "true",    description: "Wrap para próxima linha" },
      { name: "gap",       type: "int",    default: "3",       description: "Espaço entre colunas (0-5)" },
      { name: "align",     type: "string", default: '"start"', values: ["start","center","end","space-between","space-around"], description: "Alinhamento horizontal" },
      { name: "valign",    type: "string", default: '"start"', values: ["start","center","end"], description: "Alinhamento vertical" },
    ],
    slots: ["content (default) — CozyGridCols"],
    example: `CozyGrid { gap: 3; CozyGridCol { span: 6 }; CozyGridCol { span: 6 } }`,
  },

  {
    name: "CozyGridCol",
    category: "Layout",
    description: "Coluna de um CozyGrid com span responsivo.",
    props: [
      { name: "span",   type: "int", default: "12", description: "Colunas (1-12)" },
      { name: "sm",     type: "int", default: "-1",  description: "Span mobile" },
      { name: "md",     type: "int", default: "-1",  description: "Span tablet" },
      { name: "lg",     type: "int", default: "-1",  description: "Span desktop" },
      { name: "offset", type: "int", default: "0",   description: "Offset de colunas" },
    ],
    slots: ["content (default)"],
    example: `CozyGridCol { span: 12; md: 6; lg: 4 }`,
  },

  {
    name: "CozyList",
    category: "Dados",
    description: "Lista virtualizada com empty state, skeleton, ordenação e D&D.",
    props: [
      { name: "model",              type: "var",       required: true, default: "null",               description: "Fonte de dados" },
      { name: "rowContent",         type: "Component", required: true, default: "(obrigatório)",      description: "Template de linha" },
      { name: "spacing",            type: "real",      default: "Theme.spacing.sm",                   description: "Espaço entre linhas" },
      { name: "emptyStateIcon",     type: "string",    default: '"package-open"',                     description: "Ícone empty state" },
      { name: "emptyStateTitle",    type: "string",    default: '"Nenhum item"',                      description: "Título empty state" },
      { name: "emptyStateSubtitle", type: "string",    default: '""',                                 description: "Subtítulo empty state" },
      { name: "isLoading",          type: "bool",      default: "false",                              description: "Exibe skeletons" },
      { name: "sortable",           type: "bool",      default: "false",                              description: "Habilita D&D" },
      { name: "listId",             type: "string",    default: '""',                                 description: "ID único (D&D entre listas)" },
    ],
    signals: [{ name: "itemsReordered", params: "int fromIndex, int toIndex", description: "Item reordenado" }],
    example: `CozyList {
    model: myModel
    isLoading: loadingData
    rowContent: Component {
        InteractiveListCell {
            rowContent: Component { Text { text: modelData.name } }
        }
    }
}`,
  },

  {
    name: "SortableList",
    category: "Dados",
    description: "Lista que suporta reordenação de itens por drag & drop usando DelegateModel e DragHandler.",
    props: [
      { name: "model",        type: "var",       required: true, description: "Fonte de dados (JS Array ou ListModel)" },
      { name: "delegate",     type: "Component", required: true, description: "Template visual de cada item" },
      { name: "spacing",      type: "real",   default: "Theme.spacing.sm", description: "Espaçamento vertical" },
      { name: "listId",       type: "string", default: '""',               description: "ID único da lista (para D&D entre múltiplas colunas)" },
      { name: "dragKey",      type: "string", default: '"mochads-sortable"', description: "Chave interna para combinar drags compatíveis" },
      { name: "sortable",     type: "bool",   default: "true",             description: "Habilita ou desabilita reordenação" },
    ],
    signals: [
      { name: "itemsReordered",       params: "int fromIndex, int toIndex", description: "Emitido ao reordenar item na mesma lista. Sincronize seu array/model aqui!" },
      { name: "externalItemDropped",  params: "var source, int insertIndex", description: "Emitido ao receber um item de outra lista" }
    ],
    example: `SortableList {
    model: myDataArray
    delegate: Component {
        Rectangle {
            height: 40; width: parent.width
            Text { text: modelData.name }
        }
    }
    onItemsReordered: function(from, to) {
        var arr = myDataArray.slice()
        var item = arr.splice(from, 1)[0]
        arr.splice(to, 0, item)
        myDataArray = arr // Força re-render do modelo JS
    }
}`,
  },

  {
    name: "Table",
    category: "Dados",
    description: "Tabela de dados avançada com paginação, seleção por checkbox, ordenação de colunas e reordenação de linhas.",
    props: [
      { name: "columns",         type: "var",    default: "[]",    description: "Configuração das colunas: [{name, label, width, sortable, type}]" },
      { name: "rows",            type: "var",    default: "[]",    description: "Dados das linhas" },
      { name: "selectedIndexes", type: "var",    default: "[]",    description: "Índices das linhas selecionadas" },
      { name: "sortColumn",      type: "string", default: '""',    description: "Coluna de ordenação atual" },
      { name: "sortOrder",       type: "string", default: '"asc"', values: ["asc","desc"], description: "Direção da ordenação" },
      { name: "pageSize",        type: "int",    default: "5",     description: "Número de registros por página" },
      { name: "currentPage",     type: "int",    default: "1",     description: "Página ativa" },
      { name: "showPagination",  type: "bool",   default: "true",  description: "Exibe rodapé de paginação" },
      { name: "selectable",      type: "bool",   default: "true",  description: "Habilita seleção de linhas" },
      { name: "dragToReorder",   type: "bool",   default: "false", description: "Habilita drag & drop para reordenar linhas" },
    ],
    signals: [
      { name: "selectionChanged", params: "var indexes",                  description: "Seleção alterada" },
      { name: "sortChanged",      params: "string column, string order",  description: "Coluna de ordenação alterada" },
      { name: "rowsReordered",    params: "int fromIndex, int toIndex",   description: "Linhas reordenadas via drag. Sincronize a array de rows aqui!" }
    ],
    example: `Table {
    rows: myRows
    columns: [
        { name: "name", label: "Nome", width: 200, sortable: true },
        { name: "role", label: "Cargo", width: 150 }
    ]
    dragToReorder: true
    onRowsReordered: function(from, to) {
        var arr = myRows.slice()
        var item = arr.splice(from, 1)[0]
        arr.splice(to, 0, item)
        myRows = arr
    }
}`,
  },

  {
    name: "TreeTable",
    category: "Dados",
    description: "Tabela em árvore para dados hierárquicos aninhados.",
    props: [
      { name: "columns", type: "var", default: "[]", description: "Configuração das colunas" },
      { name: "rows",    type: "var", default: "[]", description: "Dados em formato de árvore contendo filhos (.children)" },
    ],
    example: `TreeTable {
    rows: [
        { name: "Pasta A", children: [ { name: "Arquivo 1" } ] }
    ]
    columns: [ { name: "name", label: "Nome", width: 300 } ]
}`,
  },

  // ──────────────────────────────────────────────────────────
  // NAVEGAÇÃO
  // ──────────────────────────────────────────────────────────
  {
    name: "Sidebar",
    category: "Navegação",
    description: [
      "Barra lateral com modos fixed/floated, colapso animado e hover-to-expand.",
      "",
      "Aceita filhos de três formas:",
      "1. **Slot `header`** — qualquer Item no topo (ex: `header: Rectangle { ... }`)",
      "2. **Slot `footer`** — qualquer Item no rodapé (ex: `footer: Button { ... }`)",
      "3. **Slot default** — SidebarHeader, SidebarFooter (detectados por flag) e SidebarSections (vai para o meio)",
    ].join("\n"),
    props: [
      { name: "variant",        type: "string", default: '"fixed"',  values: ["fixed","floated"], description: "Estilo visual" },
      { name: "isCollapsed",    type: "bool",   default: "false",    description: "Sidebar colapsada" },
      { name: "expandOnHover",  type: "bool",   default: "false",    description: "Expande ao hover (quando colapsada)" },
      { name: "collapsedWidth", type: "real",   default: "68",       description: "Largura colapsada" },
      { name: "expandedWidth",  type: "real",   default: "260",      description: "Largura expandida" },
      { name: "header",         type: "list<Item>", default: "[]",   description: "Slot livre: qualquer Item no topo. Alternativa ao SidebarHeader." },
      { name: "footer",         type: "list<Item>", default: "[]",   description: "Slot livre: qualquer Item no rodapé. Alternativa ao SidebarFooter." },
    ],
    slots: ["header: list<Item>", "footer: list<Item>", "content (default) — SidebarHeader/Footer/Section"],
    example: `// Modo 1: componentes prontos (SidebarHeader/Footer)
Sidebar {
    SidebarHeader { title: "MeuApp"; logoIcon: "coffee" }
    SidebarSection {
        SidebarItem { icon: "home"; label: "Início"; isActive: true }
    }
    SidebarFooter { username: "João"; email: "joao@mail.com" }
}

// Modo 2: conteúdo livre nos slots header/footer
Sidebar {
    header: Rectangle {
        height: 80
        color: Theme.colors.surface0
        Text { text: "Custom Header"; anchors.centerIn: parent }
    }
    footer: Button {
        text: "Sair"
        variant: "ghost"
        leftIcon: "log-out"
        height: 48
    }
    SidebarSection {
        SidebarItem { icon: "home"; label: "Início" }
    }
}`,
  },

  {
    name: "SidebarHeader",
    category: "Navegação",
    description: "Header pré-construído para Sidebar com logo, título e subtítulo. Detectado automaticamente pelo flag `isSidebarHeader`.",
    props: [
      { name: "title",     type: "string", default: '""', description: "Título principal" },
      { name: "subtitle",  type: "string", default: '""', description: "Subtítulo" },
      { name: "logoIcon",  type: "string", default: '""', description: "Ícone Lucide do logo" },
    ],
    slots: ["content (default) — conteúdo customizado (sobrepõe o default layout)"],
    example: `SidebarHeader { title: "MochaApp"; logoIcon: "coffee" }`,
  },

  {
    name: "SidebarFooter",
    category: "Navegação",
    description: "Footer pré-construído para Sidebar com avatar do usuário. Detectado automaticamente pelo flag `isSidebarFooter`.",
    props: [
      { name: "username",   type: "string", default: '""',    description: "Nome do usuário" },
      { name: "email",      type: "string", default: '""',    description: "E-mail" },
      { name: "avatarIcon", type: "string", default: '"user"', description: "Ícone Lucide do avatar" },
    ],
    example: `SidebarFooter { username: "João Silva"; email: "joao@mail.com" }`,
  },

  {
    name: "SidebarItem",
    category: "Navegação",
    description: "Item de menu com ícone, label, sub-itens aninhados e animação de chevron.",
    props: [
      { name: "icon",     type: "string", default: '""',    description: "Ícone Lucide" },
      { name: "label",    type: "string", default: '""',    description: "Texto" },
      { name: "isActive", type: "bool",   default: "false", description: "Item ativo" },
      { name: "expanded", type: "bool",   default: "false", description: "Sub-itens expandidos" },
    ],
    signals: [{ name: "clicked", description: "Clicado" }],
    slots: ["subContent (default) — SidebarItems aninhados"],
    example: `SidebarItem {
    icon: "folder"; label: "Relatórios"
    SidebarItem { icon: "file"; label: "Mensal" }
}`,
  },

  {
    name: "NavigationBar",
    category: "Navegação",
    description: "Barra de navegação inferior (mobile) com indicador animado.",
    props: [
      { name: "variant",        type: "string", default: '"standard"',          values: ["standard","floating","expanding","labeled"], description: "Estilo" },
      { name: "currentIndex",   type: "int",    default: "0",                   description: "Item ativo" },
      { name: "highlightColor", type: "color",  default: "Theme.colors.primary", description: "Cor do indicador" },
      { name: "darkMode",       type: "bool",   default: "true",                description: "Modo escuro" },
    ],
    example: `NavigationBar {
    variant: "floating"
    NavigationItem { iconName: "home";     label: "Início" }
    NavigationItem { iconName: "search";   label: "Buscar" }
    NavigationItem { iconName: "settings"; label: "Config." }
}`,
  },

  {
    name: "Breadcrumb",
    category: "Navegação",
    description: "Trilha de navegação hierárquica.",
    props: [
      { name: "items",     type: "var",    default: "[]",              description: "[{label, onClicked}]" },
      { name: "separator", type: "string", default: '"chevron-right"', description: "Ícone separador" },
      { name: "size",      type: "string", default: '"sm"',            values: ["sm","md","lg"], description: "Tamanho" },
    ],
    example: `Breadcrumb { items: [{ label: "Home", onClicked: function() { } }, { label: "Página" }] }`,
  },

  // ──────────────────────────────────────────────────────────
  // DADOS
  // ──────────────────────────────────────────────────────────
  {
    name: "Paginator",
    category: "Dados",
    description: "Paginação com navegação e total.",
    props: [
      { name: "currentPage",  type: "int", default: "1",  description: "Página atual (1-based)" },
      { name: "totalPages",   type: "int", default: "1",  description: "Total de páginas" },
      { name: "totalItems",   type: "int", default: "0",  description: "Total de itens" },
      { name: "itemsPerPage", type: "int", default: "10", description: "Itens por página" },
    ],
    signals: [{ name: "pageChanged", params: "int page", description: "Página mudou" }],
    example: `Paginator { currentPage: p; totalPages: Math.ceil(n/10); onPageChanged: function(p) { loadData(p) } }`,
  },

  {
    name: "Avatar",
    category: "Dados",
    description: "Avatar circular com imagem, ícone ou iniciais.",
    props: [
      { name: "name",       type: "string", default: '""',     description: "Nome completo (gera iniciais)" },
      { name: "src",        type: "string", default: '""',     description: "URL da imagem" },
      { name: "icon",       type: "string", default: '""',     description: "Ícone Lucide (fallback)" },
      { name: "size",       type: "string", default: '"md"',   values: ["xs","sm","md","lg","xl"], description: "Tamanho" },
      { name: "color",      type: "string", default: '"mauve"', description: "Cor do fundo" },
      { name: "showStatus", type: "bool",   default: "false",  description: "Dot de status" },
      { name: "status",     type: "string", default: '"online"', values: ["online","offline","busy","away"], description: "Status" },
    ],
    example: `Avatar { name: "João Silva"; size: "lg"; showStatus: true; status: "online" }`,
  },

  {
    name: "Tag",
    category: "Dados",
    description: "Tag/chip com ícone, dismiss e estilos.",
    props: [
      { name: "text",          type: "string", default: '""',       description: "Texto" },
      { name: "variant",       type: "string", default: '"filled"', values: ["filled","tonal","outline"], description: "Estilo" },
      { name: "color",         type: "string", default: '"mauve"',  description: "Cor" },
      { name: "size",          type: "string", default: '"md"',     values: ["sm","md","lg"], description: "Tamanho" },
      { name: "icon",          type: "string", default: '""',       description: "Ícone Lucide" },
      { name: "isDismissible", type: "bool",   default: "false",    description: "Botão X" },
    ],
    signals: [{ name: "dismissed", description: "Removido" }],
    example: `Tag { text: "React"; color: "blue"; isDismissible: true }`,
  },

  // ──────────────────────────────────────────────────────────
  // TEXTO / FORMULÁRIOS
  // ──────────────────────────────────────────────────────────
  {
    name: "TextEditor",
    category: "Texto",
    description: "Área de texto multilinha com scrollbar customizada.",
    props: [
      { name: "text",                  type: "string", default: '""',               description: "Conteúdo" },
      { name: "placeholder",           type: "string", default: '"Digite aqui..."', description: "Placeholder" },
      { name: "disabled",              type: "bool",   default: "false",            description: "Desabilita" },
      { name: "readOnly",              type: "bool",   default: "false",            description: "Somente leitura" },
      { name: "size",                  type: "string", default: '"md"',             values: ["sm","md","lg"], description: "Tamanho" },
      { name: "status",                type: "string", default: '"normal"',         values: ["normal","success","error"], description: "Estado" },
      { name: "customRadius",          type: "real",   default: "-1",               description: "Raio customizado" },
      { name: "customBorderColor",     type: "color",  default: "transparent",      description: "Borda customizada" },
      { name: "customBackgroundColor", type: "color",  default: "transparent",      description: "Fundo customizado" },
    ],
    signals: [{ name: "textEdited", description: "Conteúdo modificado" }],
    example: `TextEditor { placeholder: "Descreva o problema..."; width: 400; height: 200 }`,
  },

  {
    name: "FormField",
    category: "Texto",
    description: "Wrapper com label, descrição, asterisco e mensagem de erro.",
    props: [
      { name: "label",        type: "string", default: '""',       description: "Label" },
      { name: "description",  type: "string", default: '""',       description: "Descrição/helper" },
      { name: "errorMessage", type: "string", default: '""',       description: "Mensagem de erro" },
      { name: "required",     type: "bool",   default: "false",    description: "Asterisco obrigatório" },
      { name: "status",       type: "string", default: '"normal"', values: ["normal","success","error"], description: "Estado" },
    ],
    slots: ["content (default) — o input filho"],
    example: `FormField {
    label: "E-mail"; required: true; errorMessage: err
    TextField { type: "email"; placeholder: "seu@email.com" }
}`,
  },

  // ──────────────────────────────────────────────────────────
  // DRAG & DROP
  // ──────────────────────────────────────────────────────────
  {
    name: "Draggable",
    category: "Drag & Drop",
    description: "Wrapper para conteúdo arrastável standalone (DragHandler interno).",
    props: [
      { name: "key",         type: "string", default: '""',    description: "Chave de drag (deve combinar com DropZone.acceptedKeys)" },
      { name: "dragData",    type: "var",    default: "null",  description: "Dados passados para a DropZone" },
      { name: "enabled",     type: "bool",   default: "true",  description: "Habilita drag" },
      { name: "threshold",   type: "real",   default: "8",     description: "Pixels mínimos para ativar drag" },
      { name: "dragScale",   type: "real",   default: "1.05",  description: "Escala ao arrastar" },
      { name: "dragOpacity", type: "real",   default: "0.9",   description: "Opacidade ao arrastar" },
    ],
    signals: [
      { name: "dragStarted", params: "var data", description: "Drag iniciado" },
      { name: "dragEnded",   params: "var data", description: "Drag finalizado" },
      { name: "clicked",     description: "Clicado sem arrastar" },
    ],
    example: `Draggable {
    key: "minha-carta"; dragData: ({ uid: "card-1" })
    Rectangle { anchors.fill: parent; color: Theme.colors.mauve }
}`,
  },

  {
    name: "DropZone",
    category: "Drag & Drop",
    description: "Área de drop que aceita Draggables por chave.",
    props: [
      { name: "acceptedKeys", type: "var",  default: "[]",    description: "Chaves de drag aceitas" },
      { name: "isActive",     type: "bool", default: "false", description: "(readonly) drag compatível acima" },
    ],
    signals: [{ name: "dropped", params: "var source", description: "Item solto" }],
    example: `DropZone { acceptedKeys: ["minha-carta"]; width: 200; height: 200; onDropped: function(src) { handleDrop(src.dragData) } }`,
  },

  // ──────────────────────────────────────────────────────────
  // ANIMAÇÕES
  // ──────────────────────────────────────────────────────────
  {
    name: "FadeIn",
    category: "Animações",
    description: "Wrapper de entrada com fade opacity 0→1.",
    props: [
      { name: "duration", type: "int",  default: "300",  description: "Duração em ms" },
      { name: "trigger",  type: "bool", default: "true", description: "Inicia a animação" },
      { name: "delay",    type: "int",  default: "0",    description: "Delay antes de iniciar" },
    ],
    slots: ["content (default)"],
    example: `FadeIn { duration: 400; Text { text: "Apareci!" } }`,
  },

  {
    name: "SlideUp",
    category: "Animações",
    description: "Wrapper de entrada com slide de baixo para cima.",
    props: [
      { name: "duration", type: "int",  default: "300",  description: "Duração em ms" },
      { name: "trigger",  type: "bool", default: "true", description: "Ativa" },
      { name: "offset",   type: "real", default: "20",   description: "Distância em px" },
    ],
    slots: ["content (default)"],
    example: `SlideUp { offset: 30; Card { title: "Olá" } }`,
  },

  {
    name: "AnimatedPresence",
    category: "Animações",
    description: "Controla entrada e saída com animações configuráveis.",
    props: [
      { name: "shown",          type: "bool",   default: "false",  description: "true=entra, false=sai" },
      { name: "enterAnimation", type: "string", default: '"fade"', values: ["fade","zoom","slide","spin","flip","bounce","all"], description: "Animação de entrada" },
      { name: "exitAnimation",  type: "string", default: '"fade"', values: ["fade","zoom","slide","all"], description: "Animação de saída" },
      { name: "enterDuration",  type: "int",    default: "300",    description: "Duração de entrada em ms" },
      { name: "exitDuration",   type: "int",    default: "200",    description: "Duração de saída em ms" },
      { name: "enterOffset",    type: "real",   default: "20",     description: "Offset da animação de entrada" },
    ],
    slots: ["content (default)"],
    example: `AnimatedPresence { shown: isVisible; enterAnimation: "bounce"; exitAnimation: "fade"; Card { title: "Oi!" } }`,
  },

  {
    name: "AnimatedNumber",
    category: "Animações",
    description: "Número que anima suavemente entre valores.",
    props: [
      { name: "value",         type: "real",   default: "0",          description: "Valor alvo" },
      { name: "from",          type: "real",   default: "0",          description: "Valor inicial" },
      { name: "duration",      type: "int",    default: "600",        description: "Duração em ms" },
      { name: "easing",        type: "string", default: '"OutQuint"', description: "Tipo de easing" },
      { name: "decimalPlaces", type: "int",    default: "0",          description: "Casas decimais" },
      { name: "prefix",        type: "string", default: '""',         description: "Prefixo (ex: 'R$ ')" },
      { name: "suffix",        type: "string", default: '""',         description: "Sufixo (ex: '%')" },
      { name: "separator",     type: "string", default: '""',         description: "Separador de milhar" },
    ],
    example: `AnimatedNumber { value: total; prefix: "R$ "; separator: "."; decimalPlaces: 2; color: Theme.colors.green }`,
  },

  // ──────────────────────────────────────────────────────────
  // SINGLETONS
  // ──────────────────────────────────────────────────────────
  {
    name: "Theme",
    category: "Singletons",
    description: "Singleton de design tokens. Cores, tipografia, espaçamento e geometria. 4 flavors Catppuccin.",
    props: [
      { name: "flavor",         type: "string", default: '"mocha"', values: ["mocha","macchiato","frappe","latte"], description: "Flavor Catppuccin" },
      { name: "useSystemTheme", type: "bool",   default: "false",  description: "Detecta claro/escuro do sistema" },
    ],
    example: `Theme.flavor = "latte"
color: Theme.colors.mauve
font.family: Theme.typography.familyBold
font.pixelSize: Theme.typography.sizeMd`,
  },

  {
    name: "MochaI18n",
    category: "Singletons",
    description: "Singleton de i18n runtime. Carrega JSON, suporta interpolação {{var}} e pluralização (zero/one/other). Hot-reload ao mudar o locale.",
    props: [
      { name: "locale",         type: "string", default: '"en"',   description: "Locale ativo. Ao mudar, recarrega o JSON automaticamente." },
      { name: "fallbackLocale", type: "string", default: '"en"',   description: "Locale de fallback" },
      { name: "basePath",       type: "string", default: '""',     description: "Caminho base para os arquivos JSON" },
      { name: "isReady",        type: "bool",   default: "false",  description: "(readonly) JSON carregado" },
      { name: "debugMode",      type: "bool",   default: "false",  description: "Exibe ⚠️ na UI para chaves não encontradas" },
    ],
    methods: ["t(key, params?): string", "reload()"],
    signals: [{ name: "missingTranslation", params: "string key, string locale", description: "Chave não encontrada (debugMode=true)" }],
    example: `Component.onCompleted: {
    MochaI18n.basePath = Qt.resolvedUrl("i18n").toString()
    MochaI18n.locale = "pt-BR"
}
Text { text: MochaI18n.t("greeting", { name: "João" }) }`,
  },

  {
    name: "LucideIcon",
    category: "Singletons",
    description: "Ícone SVG da biblioteca Lucide (~1962 ícones).",
    props: [
      { name: "name",  type: "string", default: '""',                required: true, description: "Nome do ícone Lucide (ex: 'home', 'trash-2')" },
      { name: "size",  type: "real",   default: "24",                description: "Tamanho em px" },
      { name: "color", type: "color",  default: "Theme.colors.text", description: "Cor do ícone" },
    ],
    example: `LucideIcon { name: "coffee"; size: 32; color: Theme.colors.mauve }`,
  },

  // ──────────────────────────────────────────────────────────
  // ROTEAR / NAVEGAÇÃO
  // ──────────────────────────────────────────────────────────
  {
    name: "Router",
    category: "Navegação",
    description: "Roteador declarativo nativo QML com histórico e injeção automática de parâmetros e objeto router.",
    props: [
      { name: "initialRoute",        type: "string", default: '"/"',       description: "Rota a ser carregada inicialmente" },
      { name: "transitionDuration",  type: "int",    default: "220",       description: "Duração em ms do fade entre rotas (0 para desativar)" },
      { name: "notFoundComponent",   type: "Component", default: "null",   description: "Componente customizado para rotas 404" },
    ],
    signals: [
      { name: "navigationStarted",  params: "string path, var params",   description: "Navegação para um caminho iniciada" },
      { name: "navigationFinished", params: "string path, var params",   description: "Navegação finalizada e página carregada" },
      { name: "routeNotFound",      params: "string path",               description: "Tentativa de navegar para uma rota inexistente" },
    ],
    methods: [
      "push(path, params?)",
      "replace(path, params?)",
      "back()",
      "forward()",
      "go(delta)",
      "reset(path, params?)",
      "isActive(path)"
    ],
    slots: ["routes: list<QtObject> (default)"],
    example: `Router {
    id: router
    initialRoute: "/home"
    Route { path: "/home"; view: Component { Home {} } }
    Route { path: "/users/:id"; source: Qt.resolvedUrl("UserDetail.qml") }
    Route { path: "*"; view: Component { NotFound {} } }
}`,
  },

  {
    name: "Route",
    category: "Navegação",
    description: "Declaração de rota para o componente Router.",
    props: [
      { name: "path",   type: "string", default: '""', required: true, description: "Caminho da rota (ex: '/users/:id')" },
      { name: "source", type: "string", default: '""', description: "URL do arquivo QML (resolvido por Qt.resolvedUrl)" },
      { name: "view",   type: "Component", default: "null", description: "Componente inline para exibição" },
      { name: "title",  type: "string", default: '""', description: "Título amigável para breadcrumbs ou metadados" },
    ],
    example: `Route {
    path: "/profile/:username"
    source: Qt.resolvedUrl("ProfilePage.qml")
}`,
  },

  {
    name: "RouterLink",
    category: "Navegação",
    description: "Componente utilitário para navegação declarativa com detecção automática de estado ativo.",
    props: [
      { name: "to",           type: "string", default: '""', required: true, description: "Caminho de destino (ex: '/settings')" },
      { name: "params",       type: "var",    default: "{}", description: "Parâmetros adicionais de rota" },
      { name: "router",       type: "var",    default: "null", description: "Instância do Router (detectado por parent se omitido)" },
      { name: "action",       type: "string", default: '"push"', values: ["push","replace","reset"], description: "Tipo de navegação" },
      { name: "text",         type: "string", default: '""', description: "Texto rápido do link" },
      { name: "icon",         type: "string", default: '""', description: "Ícone Lucide rápido" },
      { name: "activeColor",   type: "color",  default: "Theme.colors.primary", description: "Cor do link quando ativo" },
      { name: "inactiveColor", type: "color",  default: "Theme.colors.text", description: "Cor do link quando inativo" },
    ],
    example: `RouterLink {
    to: "/settings"
    text: "Configurações"
    icon: "settings"
}`,
  },
];


// ============================================================
// GERADOR 1: componentData.ts (IntelliSense da extensão)
// ============================================================

function generateComponentDataTs() {
  const lines = [
    `// ============================================================`,
    `// src/componentData.ts`,
    `// AUTO-GERADO por cli/sync-docs.mjs — NÃO EDITE MANUALMENTE`,
    `// Para atualizar, edite cli/sync-docs.mjs e rode:`,
    `//   node cli/sync-docs.mjs`,
    `// ============================================================`,
    ``,
    `export interface PropDefinition {`,
    `  name: string;`,
    `  type: string;`,
    `  default?: string;`,
    `  values?: string[];`,
    `  required?: boolean;`,
    `  description: string;`,
    `}`,
    ``,
    `export interface SignalDefinition {`,
    `  name: string;`,
    `  params?: string;`,
    `  description: string;`,
    `}`,
    ``,
    `export interface ComponentDefinition {`,
    `  name: string;`,
    `  description: string;`,
    `  category: string;`,
    `  props: PropDefinition[];`,
    `  signals?: SignalDefinition[];`,
    `  methods?: string[];`,
    `  slots?: string[];`,
    `  example?: string;`,
    `}`,
    ``,
    `export const COMPONENTS: ComponentDefinition[] = ${JSON.stringify(COMPONENTS, null, 2)};`,
    ``,
    `export function getComponent(name: string): ComponentDefinition | undefined {`,
    `  return COMPONENTS.find(c => c.name === name);`,
    `}`,
    ``,
    `export const COMPONENT_NAMES = COMPONENTS.map(c => c.name);`,
    ``,
    `export const CATPPUCCIN_COLORS = [`,
    `  "mauve", "lavender", "blue", "sapphire", "sky", "teal",`,
    `  "green", "yellow", "peach", "maroon", "red", "pink", "flamingo", "rosewater"`,
    `];`,
    ``,
    `export const TYPOGRAPHY_TOKENS = [`,
    `  "family", "familyMedium", "familyBold",`,
    `  "sizeXs", "sizeSm", "sizeMd", "sizeLg", "sizeXl", "sizeH2", "sizeH1"`,
    `];`,
    ``,
    `export const SPACING_TOKENS = ["xs", "sm", "md", "lg", "xl", "xxl"];`,
    ``,
    `export const GEOMETRY_TOKENS = [`,
    `  "radiusSm", "radiusMd", "radiusLg", "radiusPill", "borderSm", "borderMd"`,
    `];`,
  ];

  return lines.join("\n");
}

// ============================================================
// GERADOR 2: .ai/knowledge/components.md (knowledge base)
// ============================================================

function generateKnowledgeMd() {
  const byCategory = {};
  for (const comp of COMPONENTS) {
    if (!byCategory[comp.category]) byCategory[comp.category] = [];
    byCategory[comp.category].push(comp);
  }

  const lines = [
    `# MochaDS — Knowledge Base de Componentes`,
    ``,
    `> **AUTO-GERADO por \`cli/sync-docs.mjs\`** — Não edite manualmente.`,
    `> Para atualizar: \`node cli/sync-docs.mjs\``,
    ``,
    `## Sumário`,
    ``,
    ...Object.keys(byCategory).map(cat => `- [${cat}](#${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")})`),
    ``,
    `---`,
    ``,
  ];

  for (const [category, comps] of Object.entries(byCategory)) {
    lines.push(`## ${category}`, ``);

    for (const comp of comps) {
      lines.push(`### ${comp.name}`, ``);
      lines.push(comp.description, ``);

      if (comp.props.length > 0) {
        lines.push(`| Prop | Tipo | Default | Descrição |`);
        lines.push(`|------|------|---------|-----------|`);
        for (const p of comp.props) {
          const req = p.required ? " *(obrigatório)*" : "";
          const vals = p.values ? ` — \`${p.values.join("\\|")}\`` : "";
          lines.push(`| \`${p.name}\` | \`${p.type}\`${vals} | \`${p.default ?? "—"}\` | ${p.description}${req} |`);
        }
        lines.push(``);
      }

      if (comp.signals?.length) {
        lines.push(`**Signals:**`);
        for (const s of comp.signals) {
          const params = s.params ? `(${s.params})` : "()";
          lines.push(`- \`${s.name}${params}\` — ${s.description}`);
        }
        lines.push(``);
      }

      if (comp.methods?.length) {
        lines.push(`**Métodos:** \`${comp.methods.join("\`, \`")}\``, ``);
      }

      if (comp.slots?.length) {
        lines.push(`**Slots:** ${comp.slots.join(", ")}`, ``);
      }

      if (comp.example) {
        lines.push("```qml");
        lines.push(comp.example);
        lines.push("```", ``);
      }

      lines.push(`---`, ``);
    }
  }

  return lines.join("\n");
}

// ============================================================
// MAIN
// ============================================================

function ensureDir(dir) {
  try { mkdirSync(dir, { recursive: true }); } catch {}
}

const tsPath = join(ROOT, "vscode-extension", "src", "componentData.ts");
const mdPath = join(ROOT, ".ai", "knowledge", "components.md");

ensureDir(dirname(tsPath));
ensureDir(dirname(mdPath));

writeFileSync(tsPath, generateComponentDataTs(), "utf-8");
console.log(`✅  componentData.ts  →  ${tsPath}`);

writeFileSync(mdPath, generateKnowledgeMd(), "utf-8");
console.log(`✅  components.md     →  ${mdPath}`);

console.log(`\n🎉 Sync completo! Rode 'npm run compile' na vscode-extension para aplicar.`);
