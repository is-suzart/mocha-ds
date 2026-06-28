# Changelog de Implementação — Mocha-DS

Este documento descreve **todas as alterações** realizadas no Mocha-DS, incluindo correções de bugs e novos componentes criados.

---

## FASE 1 — Correções de Bugs

### 1.1 Toast — Barra de progresso ultrapassando border-radius

**Arquivo:** `Toast.qml`

**Problema:** A barra de progresso no fundo do Toast tinha `radius: Theme.geometry.radiusMd` e o `bgRect` (container) não tinha `clip: true`. Como resultado, a barra desenhava cantos arredondados que ultrapassavam os cantos arredondados do cartão, criando um "dente" visual.

**O que foi feito:**
- Linha 58: adicionado `clip: true` ao `bgRect` — agora todos os filhos são recortados ao formato arredondado do container
- Linhas 138-146: removido `radius` da `progressBar` — a barra agora é um retângulo simples, e o clip do pai garante que ela respeite os cantos

**Antes:**
```qml
Rectangle {
    // bgRect sem clip: true
    Rectangle {
        id: progressBar
        radius: Theme.geometry.radiusMd  // <- cantos passavam da borda
    }
}
```

**Depois:**
```qml
Rectangle {
    clip: true  // <- recorta filhos no formato arredondado
    Rectangle {
        id: progressBar  // sem radius, clip do pai resolve
    }
}
```

---

### 1.2 Table — Linha reta no bottom do bodyCard

**Arquivo:** `Table.qml`

**Problema:** O `bodyCard` tinha `border.color` e `border.width`, desenhando uma borda completa ao redor do card. A borda inferior era uma linha reta horizontal entre os dois cantos arredondados, conflitando visualmente com o estilo arredondado do design system.

**O que foi feito:**
- Linhas 391-392: removidos `border.color` e `border.width` do `bodyCard`
- Apenas os `Separator` internos (entre linhas) e a cor de fundo `Theme.colors.base` definem os limites visuais do card
- O `radius` e `clip: true` foram mantidos

**Resultado:** Visual mais limpo, sem linha reta forçada no bottom.

---

### 1.3 TextEditor — Loop de binding, placeholder e clip

**Arquivo:** `TextEditor.qml`

**Problemas identificados e corrigidos:**

| # | O que era | O que foi feito |
|---|---|---|
| 1 | `bgPanel` sem `clip: true` — texto sangrava para fora dos cantos arredondados | Adicionado `clip: true` no `bgPanel` (linha 88) |
| 2 | Placeholder `Text` era **filho** do `TextEdit` — interferia com cliques, seleção e cursor | Movido para **irmão** do `Flickable` (linhas 142-154), posicionado com `anchors.fill: flickable` |
| 3 | Loop de binding: `TextEdit.onTextChanged` → seta `root.text` → `root.onTextChanged` → seta `textEdit.text` → ciclo | Handler `onTextChanged` no root removido (era linhas 166-169) e substituído por `Connections { target: root; function onTextChanged() {...} }` (linhas 168-176) que só escreve no TextEdit quando o texto realmente é diferente |

**Estrutura antes do placeholder:**
```
TextEdit
  └── Text (placeholder)  // filho, causa interferência
```

**Estrutura depois:**
```
Flickable
  └── TextEdit
Text (placeholder)  // irmão, sem interferência
```

---

### 1.4 AdvancedTextEditor — Propriedade `disabled` faltando

**Arquivo:** `AdvancedTextEditor.qml`

**Problema:** A linha 29 referenciava `disabled` sem a propriedade estar declarada:
```qml
readonly property color finalBackgroundColor: disabled ? Theme.colors.crust : Theme.colors.mantle
```
`disabled` retornava `undefined` (falsy), então `finalBackgroundColor` sempre retornava `mantle`, ignorando o estado disabled.

**O que foi feito:**
- Linha 11: adicionada a declaração:
```qml
property bool disabled: false
```

---

## FASE 2 — Novos Componentes (11)

### 2.1 Separator.qml

Linha divisória reutilizável, horizontal ou vertical.

**Uso:**
```qml
Separator {}
Separator { orientation: "vertical"; variant: "accent" }
```

**Propriedades:**
- `orientation`: `"horizontal"` (padrão) | `"vertical"`
- `variant`: `"default"` | `"subtle"` | `"accent"`
- `thickness`: espessura em px (padrão: 1)
- `margin`: margem lateral em px (padrão: 0)

---

### 2.2 RadioButton.qml

Botão de opção única (seleção exclusiva).

**Uso:**
```qml
RadioButton { label: "Opção 1"; value: "opt1" }
```

**Propriedades:**
- `label`: texto exibido ao lado do círculo
- `value`: valor associado (usado pelo RadioGroup)
- `size`: `"sm"` | `"md"` (padrão) | `"lg"`
- `checked`: estado selecionado
- `disabled`: desabilitado

**Sinais:** `clicked()`

---

### 2.3 RadioGroup.qml

Container que gerencia seleção exclusiva entre RadioButtons filhos.

**Uso:**
```qml
RadioGroup {
    selectedValue: "opt1"
    RadioButton { label: "Op 1"; value: "opt1" }
    RadioButton { label: "Op 2"; value: "opt2" }
}
```

**Propriedades:**
- `selectedValue`: valor atualmente selecionado
- `direction`: `"vertical"` (padrão) | `"horizontal"`
- `spacing`: espaçamento entre itens

**Métodos:** `select(value)`, `selectByIndex(index)`

---

### 2.4 Switch.qml

Controle liga/desliga com animação de slide.

**Uso:**
```qml
Switch { checked: true; onToggled: print(checked) }
Switch { label: "Notificações"; size: "lg" }
```

**Propriedades:**
- `checked`: estado ativado
- `disabled`: desabilitado
- `size`: `"sm"` | `"md"` (padrão) | `"lg"`
- `label`: texto opcional ao lado do switch

**Sinais:** `toggled(bool checked)`

---

### 2.5 Avatar.qml

Componente de avatar/foto de perfil com fallback de iniciais.

**Uso:**
```qml
Avatar { name: "João Silva" }
Avatar { src: "photo.jpg"; showStatus: true; isOnline: true }
```

**Propriedades:**
- `src`: URL ou path da imagem
- `name`: nome para gerar iniciais (fallback)
- `size`: `"sm"` | `"md"` (padrão) | `"lg"` | `"xl"`
- `shape`: `"circle"` (padrão) | `"rounded"`
- `variant`: `"default"` | `"accent"` | `"tonal"`
- `showStatus`: exibe indicador de status
- `isOnline`: cor verde se true, cinza se false
- `statusColor`: cor personalizada do status

---

### 2.6 Breadcrumb.qml

Navegação hierárquica com separadores.

**Uso:**
```qml
Breadcrumb {
    items: [
        { label: "Home", onClicked: function() { goHome() } },
        { label: "Produtos" },
        { label: "Detalhes" }
    ]
}
```

**Propriedades:**
- `items`: array de `{ label, onClicked }`
- `separator`: nome do ícone Lucide (padrão: `"chevron-right"`)
- `size`: `"sm"` (padrão) | `"md"`

---

### 2.7 Tag.qml

Chip/Tag para exibição de filtros, labels ou seleções.

**Uso:**
```qml
Tag { text: "React"; color: "blue"; icon: "code" }
Tag { text: "Remover"; removable: true; onRemoved: print("removido") }
```

**Propriedades:**
- `text`: texto exibido
- `variant`: `"tonal"` (padrão) | `"filled"` | `"outline"`
- `color`: cor do tema (ex: `"mauve"`, `"blue"`, `"green"`)
- `size`: `"sm"` (padrão) | `"md"` | `"lg"`
- `removable`: exibe botão X para remoção
- `selected`: estado selecionado (borda destacada)
- `icon`: ícone Lucide opcional

**Sinais:** `removed()`, `clicked()`

---

### 2.8 Slider.qml

Controle deslizante para seleção de valor numérico.

**Uso:**
```qml
Slider {
    value: 50; minimum: 0; maximum: 100; step: 5
    onValueChanged: print(value)
}
```

**Propriedades:**
- `value`: valor atual
- `minimum`: valor mínimo (padrão: 0)
- `maximum`: valor máximo (padrão: 100)
- `step`: incremento (padrão: 1)
- `disabled`: desabilitado
- `size`: `"sm"` | `"md"` (padrão) | `"lg"`

**Sinais:** `valueChanged(real value)`

---

### 2.9 EmptyState.qml

Estado vazio reutilizável (extraído do padrão inline na Table).

**Uso:**
```qml
EmptyState { icon: "search"; title: "Nada encontrado"; description: "Tente outro termo" }
```

**Propriedades:**
- `icon`: nome do ícone Lucide (padrão: `"inbox"`)
- `title`: título (padrão: `"Nenhum registro encontrado"`)
- `description`: descrição opcional
- `size`: `"sm"` | `"md"` (padrão) | `"lg"`

---

### 2.10 AlertDialog.qml

Diálogo de confirmação/alerta baseado no `Modal`.

**Uso:**
```qml
AlertDialog {
    id: alert
    dialogType: "confirm"
    dialogTitle: "Excluir item?"
    dialogMessage: "Esta ação não pode ser desfeita."
    onConfirmed: { excluir(); }
}
// Para abrir: alert.open = true
```

**Propriedades:**
- `dialogType`: `"info"` (padrão) | `"success"` | `"warning"` | `"error"` | `"confirm"`
- `dialogTitle`: título do diálogo
- `dialogMessage`: mensagem principal
- `confirmLabel`: texto do botão confirmar (padrão: `"Confirmar"`)
- `cancelLabel`: texto do botão cancelar (padrão: `"Cancelar"`)
- `showCancel`: exibir botão cancelar (padrão: `true`)

**Sinais:** `confirmed()`, `cancelled()`

---

### 2.11 ContextMenu.qml

Menu de contexto pop-over.

**Uso:**
```qml
ContextMenu {
    id: ctxMenu
    items: [
        { icon: "edit", label: "Editar", onClicked: edit() },
        { separator: true },
        { icon: "trash-2", label: "Excluir", shortcut: "Del", onClicked: remove() }
    ]
}
// Para abrir: ctxMenu.showAt(mouseX, mouseY)
```

**Propriedades:**
- `items`: array de `{ icon, label, shortcut, onClicked, separator }`
- `open`: controla visibilidade
- `offsetX` / `offsetY`: deslocamento opcional

**Métodos:** `showAt(x, y)`, `dismiss()`

**Sinais:** `closed()`

---

## FASE 3 — Registros

### 3.1 qmldir

Adicionados ao final do arquivo:

```
Separator 1.0 Separator.qml
RadioButton 1.0 RadioButton.qml
RadioGroup 1.0 RadioGroup.qml
Switch 1.0 Switch.qml
Avatar 1.0 Avatar.qml
Breadcrumb 1.0 Breadcrumb.qml
Tag 1.0 Tag.qml
Slider 1.0 Slider.qml
EmptyState 1.0 EmptyState.qml
AlertDialog 1.0 AlertDialog.qml
ContextMenu 1.0 ContextMenu.qml
```

### 3.2 test/preview.qml

Categorias atualizadas para incluir os novos componentes nas seções apropriadas (Ações, Inputs, Display, Layout, Navegação).

---

## Resumo Final

| Tipo | Quantidade |
|------|-----------|
| Arquivos corrigidos | 4 (`Toast.qml`, `Table.qml`, `TextEditor.qml`, `AdvancedTextEditor.qml`) |
| Novos componentes | 11 (`Separator`, `RadioButton`, `RadioGroup`, `Switch`, `Avatar`, `Breadcrumb`, `Tag`, `Slider`, `EmptyState`, `AlertDialog`, `ContextMenu`) |
| Total de arquivos alterados/criados | 17 |

> **Documento gerado em:** 28/06/2026
