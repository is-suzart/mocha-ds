import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Tile"
    description: "Blocos informativos compactos para dashboards e resumos de dados."

    componentItem: [
        Row {
            anchors.centerIn: parent
            spacing: DS.Theme.spacing.lg

            DS.Tile {
                width: 250
                height: 140
                title: tileTitle.text
                description: tileDesc.text
                icon: tileIcon.text
                variant: variantSelect.model[variantSelect.currentIndex]
                backgroundColor: bgSelect.model[bgSelect.currentIndex] === "none" ? "" : bgSelect.model[bgSelect.currentIndex]
                active: activeSwitch.checked
                interactive: interactiveSwitch.checked
            }
        }
    ]

    controls: [
        PlaygroundCtrlTextField {
            id: tileTitle
            label: "Título"
            text: "Faturamento"
        },
        PlaygroundCtrlTextField {
            id: tileDesc
            label: "Descrição"
            text: "R$ 45.200 (+15%)"
        },
        PlaygroundCtrlTextField {
            id: tileIcon
            label: "Ícone (Lucide Name)"
            text: "dollar-sign"
        },
        PlaygroundCtrlSelect {
            id: variantSelect
            label: "Variante"
            model: ["default", "accent", "tonal", "outline", "filled"]
            currentIndex: 0
        },
        PlaygroundCtrlSelect {
            id: bgSelect
            label: "Cor de Fundo"
            model: ["none", "base", "surface0", "mantle", "crust", "mauve", "lavender", "blue", "sapphire", "sky", "teal", "green", "yellow", "peach", "maroon", "red", "pink", "flamingo", "rosewater"]
            currentIndex: 0
            visible: variantSelect.model[variantSelect.currentIndex] === "filled"
        },
        PlaygroundCtrlSwitch {
            id: activeSwitch
            label: "Ativo"
            checked: false
        },
        PlaygroundCtrlSwitch {
            id: interactiveSwitch
            label: "Interativo"
            checked: true
        }
    ]
}
