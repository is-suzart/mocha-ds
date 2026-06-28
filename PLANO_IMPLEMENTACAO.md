# Plano de Implementação — Mocha-DS

## Visão Geral

Este documento descreve **passo a passo** todas as correções de bugs e novos componentes a serem implementados no Mocha-DS.
Cada seção contém: o arquivo alvo, o problema, a causa raiz, e o código exato a alterar.

---

## FASE 1 — Correções de Bugs

### 1.1 Toast — Barra de progresso ultrapassando o border-radius

**Arquivo:** `Toast.qml`  
**Problema:** A barra de progresso (`progressBar`) no fundo do toast desenha cantos arredondados (`radius`) que ultrapassam os cantos arredondados do `bgRect`, pois o pai não tem `clip: true`. Quando a barra encolhe, o lado direito forma um "dente" que passa por cima da curva do cartão.

**Causa raiz:** `bgRect` (linha 49) define `radius: Theme.geometry.radiusMd` mas **não** define `clip: true`. O filho `progressBar` tem seu próprio `radius` (linha 146) mas não é recortado pelo pai.

**Alterações:**

```qml
// Linha 49 - Adicionar clip: true
Rectangle {
    id: bgRect
    width: parent.width
    implicitHeight: contentLayout.implicitHeight + Theme.spacing.md * 2
    color: Theme.colors.mantle
    radius: Theme.geometry.radiusMd
    border.color: root.accentColor
    border.width: Theme.geometry.borderSm
    clip: true   // <-- ADICIONAR

// Linha 137-147 - Remover radius da progressBar (será fitada pelo clip do pai)
Rectangle {
    id: progressBar
    height: 3
    color: root.accentColor
    width: parent.width * (root.remainingTime / root.duration)
    anchors.bottom: parent.bottom
    anchors.left: parent.left
    // radius: Theme.geometry.radiusMd  <-- REMOVER (não necessário com clip: true)
}
```

**Motivo:** Com `clip: true` no `bgRect`, todos os filhos são recortados ao formato arredondado do retângulo. A `progressBar` não precisa mais de radius próprio — ela será automaticamente cortada nas bordas curvas. Isso resolve tanto o problema do canto esquerdo quanto do direito.

---

### 1.2 Table — Linha reta embaixo do bodyCard

**Arquivo:** `Table.qml`  
**Problema:** O `bodyCard` tem borda (`border.width: 1`) que desenha uma linha reta horizontal no bottom entre os dois cantos arredondados. Isso conflita visualmente com o border-radius.

**Causa raiz:** O `bodyCard` (linha 383) define border e radius. O border é desenhado pelo motor QML nas 4 bordas do retângulo arredondado. A borda inferior é tecnicamente correta (curva nos cantos), mas a porção horizontal entre os cantos é uma linha reta que o usuário percebe como "reto demais". Além disso, o último separador de linha (`Rectangle` linha 438) também chega até as bordas laterais.

**Alterações:**

Opções (escolher uma):

**Opção A (Recomendada):** Remover a borda do bodyCard e deixar os separadores de linha fazerem o trabalho visual. O visual fica mais limpo e sem linha reta no bottom.

```qml
// Linha 383-394
Rectangle {
    id: bodyCard
    anchors.top:    parent.top
    anchors.topMargin: headerCard.height + parent.headerBodyGap
    anchors.left:  parent.left
    anchors.right: parent.right
    anchors.bottom: parent.bottom
    color:  Theme.colors.base
    // border.color: Theme.colors.surface0    <-- REMOVER
    // border.width: Theme.geometry.borderSm  <-- REMOVER
    radius: Theme.geometry.radiusMd
    clip: true
}
```

**Opção B:** Se quiser manter a borda inferior, adicionar padding interno ao Flickable para que o último separador de linha não cole na borda:

```qml
// Linha 396 - Adicionar margin no Flickable
Flickable {
    id: bodyFlickable
    anchors.fill: parent
    anchors.margins: 1                    // <-- ADICIONAR (evita sobreposição com border)
    contentWidth:  root.sharedContentWidth
    contentHeight: bodyColumn.implicitHeight
    boundsBehavior: Flickable.StopAtBounds
    clip: true
}
```

---

### 1.3 TextEditor — Loop de binding recursivo e bugs

**Arquivo:** `TextEditor.qml`  
**Problema:** O componente sofre de **loop de binding recursivo** entre `root.text` e `textEdit.text`, placeholder posicionado como filho do TextEdit (interfere com cliques/seleção), falta de `clip: true` (texto sangra nos cantos), e uso de `TextEdit` primitivo em vez de `TextArea`.

**Bugs detalhados:**

| Linha | Bug |
|-------|-----|
| 132-136 | `TextEdit.onTextChanged` seta `root.text = text` |
| 166-169 | `root.onTextChanged` seta `textEdit.text = text` |
| | **Resultado:** ciclo de atualização. Cada alteração dispara a outra. Causa flicker, perda de cursor em edge cases. |
| 140-149 | Placeholder `Text` é filho de `TextEdit`. Interfere com coordenadas de mouse, seleção de texto e cursor. |
| 81-91 | `bgPanel` sem `clip: true`. Texto com wrap pode sangrar para fora dos cantos arredondados. |

**Alterações:**

**Passo 1:** Adicionar `clip: true` ao bgPanel (linha 81):

```qml
Rectangle {
    id: bgPanel
    anchors.fill: parent
    color: root.finalBackgroundColor
    radius: root.finalRadius
    border.color: root.finalBorderColor
    border.width: textEdit.activeFocus ? Theme.geometry.borderMd : Theme.geometry.borderSm
    clip: true   // <-- ADICIONAR

    Behavior on color { ColorAnimation { duration: 150 } }
    Behavior on border.color { ColorAnimation { duration: 150 } }
}
```

**Passo 2:** Substituir o placeholder filho do TextEdit por um placeholder irmão, posicionado sobre o Flickable:

```qml
// Linha 106-151 - Refatorar Flickable + TextEdit + Placeholder

Flickable {
    id: flickable
    anchors.fill: parent
    anchors.margins: root.currentPadding
    contentWidth: width
    contentHeight: textEdit.paintedHeight
    clip: true

    TextEdit {
        id: textEdit
        width: parent.width
        text: root.text
        font.family: Theme.typography.family
        font.pixelSize: root.currentFontSize
        color: root.disabled ? Theme.colors.overlay0 : Theme.colors.text
        selectionColor: Theme.colors.surface2
        selectedTextColor: Theme.colors.text
        wrapMode: TextEdit.Wrap
        selectByMouse: true
        readOnly: root.readOnly
        enabled: !root.disabled
        cursorVisible: activeFocus
        antialiasing: true

        onTextChanged: {
            if (root.text !== text) {
                root.text = text;
                root.textEdited();
            }
        }
    }
}

// Placeholder irmão, NÃO filho do TextEdit
Text {
    text: root.placeholder
    font.family: Theme.typography.family
    font.pixelSize: root.currentFontSize
    color: Theme.colors.overlay0
    visible: textEdit.text === "" && !textEdit.activeFocus
    anchors.fill: flickable
    wrapMode: Text.Wrap
    antialiasing: true
}
```

**Passo 3:** Remover o handler `onTextChanged` duplicado do root (linha 166-169):

```qml
// Linha 166-169 - REMOVER este bloco inteiro
// onTextChanged: {
//     if (textEdit.text !== text) {
//         textEdit.text = text;
//     }
// }
```

**Passo 4:** Manter apenas a sincronização externa (quando `root.text` é alterado de fora, atualiza o TextEdit):

```qml
// Adicionar isto NO LUGAR do bloco removido no passo 3:
Connections {
    target: root
    function onTextChanged() {
        if (textEdit.text !== root.text) {
            textEdit.text = root.text;
        }
    }
}
```

Isso quebra o ciclo: `textEdit.onTextChanged` → seta `root.text` → `root.onTextChanged` → checa se diferente e seta `textEdit.text`, mas como são iguais, não faz nada.

**Nota sobre TextArea:** Substituir `TextEdit` por `TextArea` (QtQuick.Controls 2.15) traria `placeholderText` nativo, mas exigiria refatoração maior incluindo `import QtQuick.Controls 2.15`, `ScrollView` em vez de `Flickable`, e `TextArea.flickable` para o ScrollBar. A abordagem acima resolve os bugs sem quebrar compatibilidade.

---

### 1.4 AdvancedTextEditor — Propriedade `disabled` não declarada

**Arquivo:** `AdvancedTextEditor.qml`  
**Problema:** A linha 29 referencia `disabled`:
```qml
readonly property color finalBackgroundColor: disabled ? Theme.colors.crust : Theme.colors.mantle
```
Mas o componente **não declara** `property bool disabled`. Isso faz `disabled` retornar `undefined` (que é falsy), então funciona por coincidência. Mas se alguém definir `disabled: true` externamente, vai falhar.

**Alteração:**

```qml
// Adicionar após a linha 11 (junto com readOnly)
property bool disabled: false
```

---

## FASE 2 — Novos Componentes

### Padrão de Criação

Todos os componentes seguem este template:

```
import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API (Properties)
    // ==========================================

    // ==========================================
    // Internal Style Tokens & Helpers
    // ==========================================

    // ==========================================
    // Visual Tree
    // ==========================================
}
```

Usar tokens do **Theme.qml** singleton: `Theme.colors.*`, `Theme.typography.*`, `Theme.geometry.*`, `Theme.spacing.*`.

---

### 2.1 Divider / Separator

**Arquivo:** `Separator.qml`

Componente simples reutilizado inline em Toast, Table, AdvancedTextEditor e Card. Evita duplicação de `Rectangle { width: parent.width; height: 1; color: Theme.colors.surface0 }`.

```qml
import QtQuick 2.15

Item {
    id: root

    // ==========================================
    // Public API
    // ==========================================
    property string orientation: "horizontal" // "horizontal" | "vertical"
    property string variant: "default"        // "default" | "subtle" | "accent"
    property real thickness: 1
    property real margin: 0

    // ==========================================
    // Visual Tree
    // ==========================================
    implicitWidth: orientation === "vertical" ? thickness : 100
    implicitHeight: orientation === "horizontal" ? thickness : 40
    width: implicitWidth
    height: implicitHeight

    Rectangle {
        anchors.centerIn: parent
        width: root.orientation === "horizontal" ? parent.width - root.margin * 2 : root.thickness
        height: root.orientation === "vertical" ? parent.height - root.margin * 2 : root.thickness
        radius: root.thickness / 2
        color: {
            if (root.variant === "accent") return Theme.colors.primary
            if (root.variant === "subtle") return Theme.colors.surface0
            return Theme.colors.surface1
        }
    }
}
```

**Uso:** `<Separator />` em vez de `Rectangle { height: 1; width: parent.width; color: Theme.colors.surface0 }`.

---

### 2.2 RadioButton + RadioGroup

**Arquivos:** `RadioButton.qml`, `RadioGroup.qml`

#### RadioButton.qml

```qml
import QtQuick 2.15

Item {
    id: root

    property string label: ""
    property string value: ""
    property string size: "md"       // "sm" | "md" | "lg"
    property bool checked: false
    property bool disabled: false

    signal clicked()

    readonly property real radioSize: size === "sm" ? 14 : (size === "lg" ? 22 : 18)
    readonly property real fontSize: size === "sm" ? Theme.typography.sizeXs : (size === "lg" ? Theme.typography.sizeMd : Theme.typography.sizeSm)

    implicitWidth: radioRow.implicitWidth
    implicitHeight: Math.max(radioSize, radioLabel.implicitHeight)
    width: implicitWidth
    height: implicitHeight

    opacity: disabled ? 0.5 : 1.0

    Row {
        id: radioRow
        spacing: Theme.spacing.sm
        anchors.verticalCenter: parent.verticalCenter

        // Outer ring
        Rectangle {
            width: root.radioSize
            height: root.radioSize
            radius: root.radioSize / 2
            color: "transparent"
            border.color: root.checked ? Theme.colors.primary : Theme.colors.surface2
            border.width: root.checked ? 5 : Theme.geometry.borderMd
            anchors.verticalCenter: parent.verticalCenter

            Behavior on border.color { ColorAnimation { duration: 150 } }
            Behavior on border.width { NumberAnimation { duration: 100 } }
        }

        Text {
            id: radioLabel
            text: root.label
            font.family: Theme.typography.family
            font.pixelSize: root.fontSize
            color: root.disabled ? Theme.colors.overlay0 : Theme.colors.text
            anchors.verticalCenter: parent.verticalCenter
            antialiasing: true
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
        enabled: !root.disabled
        onClicked: {
            if (!root.checked) {
                root.clicked()
            }
        }
    }
}
```

#### RadioGroup.qml

```qml
import QtQuick 2.15

Item {
    id: root

    property string selectedValue: ""
    property string direction: "vertical" // "vertical" | "horizontal"
    property real spacing: Theme.spacing.md

    default property alias content: container.data

    implicitWidth: container.implicitWidth
    implicitHeight: container.implicitHeight
    width: implicitWidth
    height: implicitHeight

    function select(value) {
        selectedValue = value;
        // Propagar para RadioButtons filhos
        for (var i = 0; i < container.children.length; i++) {
            var child = container.children[i];
            if (child.hasOwnProperty("checked")) {
                child.checked = (child.value === value);
            }
        }
    }

    Column {
        id: container
        spacing: root.spacing

        Component.onCompleted: {
            for (var i = 0; i < root.children.length; i++) {
                var child = root.children[i];
                if (child !== container) {
                    child.parent = container;
                    if (child.hasOwnProperty("checked") && child.hasOwnProperty("clicked")) {
                        child.clicked.connect(function() {
                            root.select(child.value);
                        });
                    }
                }
            }
        }
    }
}
```

**Uso:**
```qml
RadioGroup {
    selectedValue: "option1"

    RadioButton { label: "Opção 1"; value: "option1" }
    RadioButton { label: "Opção 2"; value: "option2" }
    RadioButton { label: "Opção 3"; value: "option3"; disabled: true }
}
```

---

### 2.3 Switch / Toggle

**Arquivo:** `Switch.qml`

Diferente do `ToggleButton` (que é um botão de pressionar), o Switch é um controle on/off com animação de slide.

```qml
import QtQuick 2.15

Item {
    id: root

    property bool checked: false
    property bool disabled: false
    property string size: "md" // "sm" | "md" | "lg"

    signal toggled(bool checked)

    readonly property real trackWidth: size === "sm" ? 36 : (size === "lg" ? 56 : 44)
    readonly property real trackHeight: size === "sm" ? 20 : (size === "lg" ? 32 : 24)
    readonly property real thumbSize: trackHeight - 6

    implicitWidth: trackWidth
    implicitHeight: trackHeight
    width: implicitWidth
    height: implicitHeight

    opacity: disabled ? 0.5 : 1.0

    Rectangle {
        id: track
        width: root.trackWidth
        height: root.trackHeight
        radius: root.trackHeight / 2
        color: root.checked ? Theme.colors.primary : Theme.colors.surface0
        border.color: root.checked ? Theme.colors.primary : Theme.colors.surface2
        border.width: 1
        anchors.centerIn: parent

        Behavior on color { ColorAnimation { duration: 150 } }
        Behavior on border.color { ColorAnimation { duration: 150 } }
    }

    Rectangle {
        id: thumb
        width: root.thumbSize
        height: root.thumbSize
        radius: root.thumbSize / 2
        color: root.checked ? Theme.colors.crust : Theme.colors.crust
        x: root.checked ? root.trackWidth - root.thumbSize - 3 : 3
        anchors.verticalCenter: track.verticalCenter

        Behavior on x { NumberAnimation { duration: 150; easing.type: Easing.OutBack } }

        LucideIcon {
            name: root.checked ? "check" : "x"
            size: root.thumbSize * 0.55
            color: root.checked ? Theme.colors.primary : Theme.colors.overlay0
            anchors.centerIn: parent
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
        enabled: !root.disabled
        onClicked: {
            root.checked = !root.checked;
            root.toggled(root.checked);
        }
    }
}
```

---

### 2.4 Avatar

**Arquivo:** `Avatar.qml`

```qml
import QtQuick 2.15
import QtGraphicalEffects 1.15

Item {
    id: root

    property string src: ""           // URL ou path da imagem
    property string name: ""          // Fallback: iniciais (ex: "John Doe" → "JD")
    property string size: "md"        // "sm" | "md" | "lg" | "xl"
    property string shape: "circle"   // "circle" | "rounded"
    property string variant: "default" // "default" | "accent" | "tonal"
    property bool showStatus: false   // Indicador online/offline
    property bool isOnline: false

    readonly property real avatarSize: {
        if (size === "sm") return 32
        if (size === "lg") return 56
        if (size === "xl") return 80
        return 40 // md
    }

    implicitWidth: avatarSize
    implicitHeight: avatarSize
    width: implicitWidth
    height: implicitHeight

    // Fundo circular
    Rectangle {
        anchors.fill: parent
        radius: shape === "circle" ? avatarSize / 2 : Theme.geometry.radiusMd
        color: {
            if (variant === "accent") return Theme.colors.primary
            if (variant === "tonal") return Theme.colors.surface0
            return Theme.colors.mantle
        }
        clip: true

        // Imagem (se src fornecida)
        Image {
            anchors.fill: parent
            source: root.src
            fillMode: Image.PreserveAspectCrop
            visible: root.src !== ""
        }

        // Iniciais (fallback)
        Text {
            text: {
                var parts = root.name.split(" ");
                if (parts.length >= 2) return parts[0][0] + parts[parts.length-1][0];
                if (parts.length === 1 && parts[0].length >= 1) return parts[0][0];
                return "?";
            }
            font.family: Theme.typography.familyBold
            font.pixelSize: avatarSize * 0.4
            color: root.variant === "accent" ? Theme.colors.crust : Theme.colors.text
            anchors.centerIn: parent
            visible: root.src === ""
            antialiasing: true
        }
    }

    // Status indicator
    Rectangle {
        width: avatarSize * 0.28
        height: avatarSize * 0.28
        radius: width / 2
        color: root.isOnline ? Theme.colors.success : Theme.colors.overlay1
        border.color: Theme.colors.base
        border.width: 2
        visible: root.showStatus
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        anchors.rightMargin: -1
        anchors.bottomMargin: -1
    }
}
```

---

### 2.5 Breadcrumb

**Arquivo:** `Breadcrumb.qml`

```qml
import QtQuick 2.15

Item {
    id: root

    property var items: []       // Array de { label, onClicked }
    property string separator: "/"
    property string size: "sm"  // "sm" | "md"

    readonly property real fontSize: size === "sm" ? Theme.typography.sizeSm : Theme.typography.sizeMd

    implicitWidth: breadRow.implicitWidth
    implicitHeight: breadRow.implicitHeight
    width: implicitWidth
    height: implicitHeight

    Row {
        id: breadRow
        spacing: Theme.spacing.sm

        Repeater {
            model: root.items

            Row {
                spacing: Theme.spacing.sm

                Text {
                    text: modelData.label
                    font.family: index === root.items.length - 1 ? Theme.typography.familyBold : Theme.typography.family
                    font.pixelSize: root.fontSize
                    color: index === root.items.length - 1 ? Theme.colors.text : Theme.colors.primary
                    anchors.verticalCenter: parent.verticalCenter
                    antialiasing: true

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: index === root.items.length - 1 ? Qt.ArrowCursor : Qt.PointingHandCursor
                        hoverEnabled: true
                        enabled: typeof modelData.onClicked === "function" && index < root.items.length - 1
                        onClicked: {
                            if (typeof modelData.onClicked === "function") {
                                modelData.onClicked();
                            }
                        }
                    }
                }

                LucideIcon {
                    name: "chevron-right"
                    size: root.fontSize
                    color: Theme.colors.overlay0
                    visible: index < root.items.length - 1
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }
    }
}
```

**Uso:**
```qml
Breadcrumb {
    items: [
        { label: "Home", onClicked: function() { goHome() } },
        { label: "Produtos", onClicked: function() { goProducts() } },
        { label: "Detalhes" }
    ]
}
```

---

### 2.6 Tag / Chip

**Arquivo:** `Tag.qml`

Semelhante ao `Badge`, mas com foco em seleção múltipla, filtros e remoção.

```qml
import QtQuick 2.15

Item {
    id: root

    property string text: ""
    property string variant: "tonal"   // "tonal" | "filled" | "outline"
    property string color: "mauve"
    property string size: "sm"
    property bool removable: false
    property bool selected: false
    property string icon: ""

    signal removed()
    signal clicked()

    readonly property real tagHeight: size === "sm" ? 26 : (size === "lg" ? 36 : 30)
    readonly property real fontSize: size === "sm" ? Theme.typography.sizeXs : Theme.typography.sizeSm
    readonly property real iconSize: size === "sm" ? 12 : 14

    readonly property color resolvedColor: Theme.colors[color] !== undefined ? Theme.colors[color] : Theme.colors.primary

    readonly property color finalBg: {
        if (variant === "filled") return resolvedColor;
        return Qt.rgba(resolvedColor.r, resolvedColor.g, resolvedColor.b, 0.12);
    }

    readonly property color finalBorderColor: {
        if (variant === "outline") return resolvedColor;
        if (variant === "tonal") return Qt.rgba(resolvedColor.r, resolvedColor.g, resolvedColor.b, 0.20);
        return "transparent";
    }

    readonly property color finalTextColor: {
        if (variant === "filled") return Theme.colors.crust;
        return resolvedColor;
    }

    implicitWidth: contentRow.implicitWidth + Theme.spacing.md * 2
    implicitHeight: tagHeight
    width: implicitWidth
    height: implicitHeight

    Rectangle {
        anchors.fill: parent
        radius: Theme.geometry.radiusPill
        color: root.finalBg
        border.color: root.selected ? resolvedColor : root.finalBorderColor
        border.width: root.selected ? 2 : Theme.geometry.borderSm

        Behavior on color { ColorAnimation { duration: 150 } }
    }

    Row {
        id: contentRow
        anchors.centerIn: parent
        spacing: 4

        LucideIcon {
            name: root.icon
            size: root.iconSize
            color: root.finalTextColor
            visible: root.icon !== ""
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            text: root.text
            font.family: Theme.typography.familyMedium
            font.pixelSize: root.fontSize
            color: root.finalTextColor
            anchors.verticalCenter: parent.verticalCenter
            antialiasing: true
        }

        LucideIcon {
            name: "x"
            size: root.iconSize
            color: root.finalTextColor
            visible: root.removable
            anchors.verticalCenter: parent.verticalCenter

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: root.removed()
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: root.clicked()
    }
}
```

---

### 2.7 Slider / RangeSlider

**Arquivo:** `Slider.qml`

```qml
import QtQuick 2.15

Item {
    id: root

    property real value: 0
    property real minimum: 0
    property real maximum: 100
    property real step: 1
    property bool disabled: false
    property string size: "md"     // "sm" | "md" | "lg"

    signal valueChanged(real value)

    readonly property real trackHeight: size === "sm" ? 4 : (size === "lg" ? 8 : 6)
    readonly property real thumbSize: size === "sm" ? 14 : (size === "lg" ? 22 : 18)
    readonly property real normalizedValue: (value - minimum) / (maximum - minimum)

    implicitWidth: 200
    implicitHeight: Math.max(trackHeight, thumbSize)
    width: implicitWidth
    height: implicitHeight

    opacity: disabled ? 0.5 : 1.0

    // Track background
    Rectangle {
        id: track
        width: parent.width
        height: root.trackHeight
        radius: root.trackHeight / 2
        color: Theme.colors.surface1
        anchors.verticalCenter: parent.verticalCenter
    }

    // Track fill
    Rectangle {
        width: parent.width * root.normalizedValue
        height: root.trackHeight
        radius: root.trackHeight / 2
        color: Theme.colors.primary
        anchors.verticalCenter: parent.verticalCenter
        Behavior on width { NumberAnimation { duration: 50 } }
    }

    // Thumb
    Rectangle {
        id: thumb
        width: root.thumbSize
        height: root.thumbSize
        radius: root.thumbSize / 2
        color: Theme.colors.crust
        border.color: Theme.colors.primary
        border.width: 2
        x: (parent.width - root.thumbSize) * root.normalizedValue
        anchors.verticalCenter: parent.verticalCenter

        Behavior on x { NumberAnimation { duration: 50 } }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
        enabled: !root.disabled
        onPositionChanged: {
            if (pressed) {
                var ratio = Math.max(0, Math.min(1, mouse.x / width));
                var raw = root.minimum + ratio * (root.maximum - root.minimum);
                root.value = Math.round(raw / root.step) * root.step;
                root.valueChanged(root.value);
            }
        }
        onClicked: {
            var ratio = Math.max(0, Math.min(1, mouse.x / width));
            var raw = root.minimum + ratio * (root.maximum - root.minimum);
            root.value = Math.round(raw / root.step) * root.step;
            root.valueChanged(root.value);
        }
    }
}
```

---

### 2.8 EmptyState

**Arquivo:** `EmptyState.qml`

Extraído do padrão inline na Table (linha 547-569).

```qml
import QtQuick 2.15

Item {
    id: root

    property string icon: "inbox"
    property string title: "Nenhum registro encontrado"
    property string description: ""
    property string size: "md" // "sm" | "md" | "lg"

    signal actionClicked()

    readonly property real iconSize: size === "sm" ? 24 : (size === "lg" ? 56 : 40)
    readonly property real titleFontSize: size === "sm" ? Theme.typography.sizeSm : (size === "lg" ? Theme.typography.sizeLg : Theme.typography.sizeMd)

    implicitWidth: 200
    implicitHeight: contentColumn.implicitHeight + Theme.spacing.xl * 2
    width: implicitWidth
    height: implicitHeight

    Column {
        id: contentColumn
        anchors.centerIn: parent
        spacing: Theme.spacing.sm

        LucideIcon {
            name: root.icon
            size: root.iconSize
            color: Theme.colors.overlay0
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Text {
            text: root.title
            font.family: Theme.typography.familyMedium
            font.pixelSize: root.titleFontSize
            color: Theme.colors.overlay0
            anchors.horizontalCenter: parent.horizontalCenter
            antialiasing: true
        }

        Text {
            text: root.description
            font.family: Theme.typography.family
            font.pixelSize: Theme.typography.sizeSm
            color: Theme.colors.overlay1
            visible: root.description !== ""
            anchors.horizontalCenter: parent.horizontalCenter
            horizontalAlignment: Text.AlignHCenter
            antialiasing: true
        }
    }
}
```

---

### 2.9 AlertDialog / ConfirmDialog

**Arquivo:** `AlertDialog.qml`

Wrapper sobre o `Modal` existente para diálogos de confirmação.

```qml
import QtQuick 2.15

Item {
    id: root

    property string title: ""
    property string message: ""
    property string type: "info"          // "info" | "success" | "warning" | "error" | "confirm"
    property string confirmLabel: "Confirmar"
    property string cancelLabel: "Cancelar"
    property bool showCancel: true
    property bool open: false

    signal confirmed()
    signal cancelled()

    visible: false

    readonly property color accentColor: {
        if (type === "success") return Theme.colors.green
        if (type === "warning") return Theme.colors.yellow
        if (type === "error") return Theme.colors.danger
        return Theme.colors.primary
    }

    readonly property string typeIcon: {
        if (type === "success") return "check-circle"
        if (type === "warning") return "alert-triangle"
        if (type === "error") return "alert-circle"
        if (type === "confirm") return "help-circle"
        return "info"
    }

    onOpenChanged: {
        if (open) {
            modalRef.openModal(root);
        }
    }

    function show() {
        var container = {
            "title": root.title,
            "message": root.message,
            "type": root.type,
            "accentColor": root.accentColor,
            "typeIcon": root.typeIcon,
            "confirmLabel": root.confirmLabel,
            "cancelLabel": root.cancelLabel,
            "showCancel": root.showCancel,
            "onConfirmed": root.confirmed,
            "onCancelled": root.cancelled
        };
        modalRef.openModal(container);
    }

    Modal {
        id: modalRef

        function openModal(props) {
            // Inject content dynamically
            dialogContent.titleText = props.title;
            dialogContent.messageText = props.message;
            dialogContent.confirmLabel = props.confirmLabel;
            dialogContent.cancelLabel = props.cancelLabel;
            dialogContent.showCancel = props.showCancel;
            dialogContent.iconName = props.typeIcon;
            dialogContent.iconColor = props.accentColor;
            modalRef.open();
        }

        width: 420
        height: dialogColumn.implicitHeight + Theme.spacing.xl * 2
        radius: Theme.geometry.radiusMd
        closeOnOutsideClick: true

        onClosed: {
            if (dialogContent._result === "confirmed") {
                root.confirmed();
            } else {
                root.cancelled();
            }
        }

        Rectangle {
            anchors.fill: parent
            color: Theme.colors.base
            radius: parent.radius
            z: -1
        }

        Column {
            id: dialogColumn
            anchors.fill: parent
            anchors.margins: Theme.spacing.xl
            spacing: Theme.spacing.lg

            Item {
                id: dialogContent
                width: parent.width
                height: dialogContentColumn.implicitHeight

                property string titleText: ""
                property string messageText: ""
                property string iconName: "info"
                property color iconColor: Theme.colors.primary
                property string confirmLabel: "Confirmar"
                property string cancelLabel: "Cancelar"
                property bool showCancel: true
                property string _result: ""

                Column {
                    id: dialogContentColumn
                    width: parent.width
                    spacing: Theme.spacing.md

                    Row {
                        spacing: Theme.spacing.md
                        width: parent.width

                        LucideIcon {
                            name: dialogContent.iconName
                            size: 28
                            color: dialogContent.iconColor
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Column {
                            spacing: Theme.spacing.xs
                            width: parent.width - 28 - Theme.spacing.md

                            Text {
                                text: dialogContent.titleText
                                font.family: Theme.typography.familyBold
                                font.pixelSize: Theme.typography.sizeLg
                                color: Theme.colors.text
                                width: parent.width
                                wrapMode: Text.WordWrap
                                antialiasing: true
                            }

                            Text {
                                text: dialogContent.messageText
                                font.family: Theme.typography.family
                                font.pixelSize: Theme.typography.sizeMd
                                color: Theme.colors.subtext0
                                width: parent.width
                                wrapMode: Text.WordWrap
                                antialiasing: true
                            }
                        }
                    }
                }
            }

            Row {
                width: parent.width
                spacing: Theme.spacing.md
                layoutDirection: Qt.RightToLeft

                Button {
                    variant: dialogContent.iconColor === Theme.colors.danger ? "danger" : "primary"
                    text: dialogContent.confirmLabel
                    onClicked: {
                        dialogContent._result = "confirmed";
                        modalRef.close();
                    }
                }

                Button {
                    variant: "ghost"
                    text: dialogContent.cancelLabel
                    visible: dialogContent.showCancel
                    onClicked: {
                        dialogContent._result = "cancelled";
                        modalRef.close();
                    }
                }
            }
        }
    }
}
```

---

### 2.10 ContextMenu

**Arquivo:** `ContextMenu.qml`

```qml
import QtQuick 2.15

Item {
    id: root

    property var items: []          // Array de { icon, label, shortcut, onClicked, separator }
    property bool open: false

    signal closed()

    visible: false
    width: 200
    height: menuColumn.implicitHeight + Theme.spacing.sm * 2

    z: Theme.getNextMaxZ()

    onOpenChanged: {
        if (open) {
            root.visible = true;
            root.z = Theme.getNextMaxZ();
        }
    }

    function showAt(x, y) {
        root.x = Math.min(x, root.parent ? root.parent.width - root.width : x);
        root.y = Math.min(y, root.parent ? root.parent.height - root.height : y);
        root.open = true;
    }

    function dismiss() {
        root.open = false;
        root.visible = false;
        root.closed();
    }

    Rectangle {
        anchors.fill: parent
        color: Theme.colors.mantle
        radius: Theme.geometry.radiusMd
        border.color: Theme.colors.surface0
        border.width: Theme.geometry.borderSm

        MouseArea {
            anchors.fill: parent
            // Bloqueia cliques fora do menu
        }
    }

    Column {
        id: menuColumn
        width: parent.width
        anchors.top: parent.top
        anchors.topMargin: Theme.spacing.sm
        spacing: 0

        Repeater {
            model: root.items

            delegate: Item {
                width: parent.width
                height: modelData.separator ? 9 : 36

                // Separator
                Rectangle {
                    width: parent.width - Theme.spacing.md * 2
                    height: 1
                    color: Theme.colors.surface0
                    anchors.centerIn: parent
                    visible: modelData.separator === true
                }

                // Menu item
                Rectangle {
                    anchors.fill: parent
                    anchors.leftMargin: Theme.spacing.sm
                    anchors.rightMargin: Theme.spacing.sm
                    radius: Theme.geometry.radiusSm
                    color: menuItemMouse.containsMouse ? Theme.colors.surface0 : "transparent"
                    visible: !modelData.separator

                    Behavior on color { ColorAnimation { duration: 100 } }

                    Row {
                        anchors.fill: parent
                        anchors.leftMargin: Theme.spacing.md
                        anchors.rightMargin: Theme.spacing.md
                        spacing: Theme.spacing.md

                        LucideIcon {
                            name: modelData.icon || ""
                            size: 16
                            color: Theme.colors.subtext0
                            visible: modelData.icon !== undefined && modelData.icon !== ""
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: modelData.label || ""
                            font.family: Theme.typography.family
                            font.pixelSize: Theme.typography.sizeMd
                            color: Theme.colors.text
                            anchors.verticalCenter: parent.verticalCenter
                            antialiasing: true
                        }

                        Item { width: 1; height: 1; visible: true } // spacer

                        Text {
                            text: modelData.shortcut || ""
                            font.family: Theme.typography.family
                            font.pixelSize: Theme.typography.sizeXs
                            color: Theme.colors.overlay1
                            anchors.verticalCenter: parent.verticalCenter
                            visible: modelData.shortcut !== undefined && modelData.shortcut !== ""
                            antialiasing: true
                        }
                    }

                    MouseArea {
                        id: menuItemMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if (typeof modelData.onClicked === "function") {
                                modelData.onClicked();
                            }
                            root.dismiss();
                        }
                    }
                }
            }
        }
    }

    // Close on outside click
    Item {
        anchors.fill: root.parent
        z: root.z - 1
        visible: root.open

        MouseArea {
            anchors.fill: parent
            onClicked: root.dismiss()
        }
    }
}
```

---

## FASE 3 — Atualização de Registros

### 3.1 Atualizar `qmldir`

Adicionar ao final do arquivo `qmldir`:

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

### 3.2 Atualizar `test/preview.qml`

Adicionar os novos componentes nas categorias relevantes:

```js
// Linha 19 - Categorias atualizadas
property var categories: [
    { id: "actions", label: "Ações", icon: "mouse-pointer", components: ["Button", "ButtonGroup", "ToggleButton", "Switch", "Dropdown"] },
    { id: "inputs", label: "Inputs", icon: "edit-3", components: ["TextField", "Checkbox", "RadioButton", "RadioGroup", "Select", "AdvancedSelect", "Slider"] },
    { id: "display", label: "Display", icon: "eye", components: ["Badge", "Tag", "Avatar", "ProgressBar", "Spinner", "Skeleton", "Tooltip", "Toast"] },
    { id: "layout", label: "Layout", icon: "layout", components: ["Card", "Tile", "Accordion", "Modal", "Drawer", "EmptyState", "AlertDialog"] },
    { id: "data", label: "Dados", icon: "database", components: ["Table", "Paginator"] },
    { id: "charts", label: "Gráficos", icon: "pie-chart", components: ["Charts", "PieChart"] },
    { id: "navigation", label: "Navegação", icon: "navigation", components: ["Navigation", "Sidebar", "Breadcrumb", "ContextMenu"] }
]
```

---

## Ordem de Execução Sugerida

1. **FASE 1 — Bugs (prioridade máxima, ~1h)**
   - 1.3 TextEditor (bug mais crítico, quebra uso básico)
   - 1.1 Toast (problema visual)
   - 1.2 Table (problema visual)
   - 1.4 AdvancedTextEditor (propriedade faltando)

2. **FASE 2 — Componentes novos (prioridade média, ~4h)**
   - 2.1 Separator (usado para refatorar os fixes acima)
   - 2.2 RadioButton + RadioGroup
   - 2.3 Switch
   - 2.4 Avatar
   - 2.5 Breadcrumb
   - 2.6 Tag
   - 2.7 Slider
   - 2.8 EmptyState
   - 2.9 AlertDialog
   - 2.10 ContextMenu

3. **FASE 3 — Registro (~15min)**
   - 3.1 Atualizar qmldir
   - 3.2 Atualizar preview.qml

4. **Verificação:** Rodar `run_preview.sh` e inspecionar visualmente cada componente.
