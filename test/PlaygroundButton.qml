import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Button"
    description: "Botões versáteis com múltiplos variantes, tamanhos e estados."

    // The component being tested
    componentItem: [
        DS.Button {
            text: btnText.text
            variant: variantSelect.model[variantSelect.currentIndex]
            color: colorSelect.model[colorSelect.currentIndex]
            size: sizeSelect.model[sizeSelect.currentIndex]
            icon: iconText.text
            disabled: disabledSwitch.checked
            isLoading: loadingSwitch.checked
            width: expandSwitch.checked ? 300 : implicitWidth
            anchors.centerIn: parent
        }
    ]
    // Controls to change props
    controls: [
        PlaygroundCtrlTextField {
            id: btnText

            label: "Texto do Botão"
            text: "Clique Aqui"
        },
        PlaygroundCtrlTextField {
            id: iconText

            label: "Ícone (Lucide Name)"
            text: "coffee"
        },
        PlaygroundCtrlSelect {
            id: variantSelect

            label: "Variante"
            model: ["primary", "secondary", "filled", "outline", "ghost", "tonal", "danger"]
            currentIndex: 0
        },
        PlaygroundCtrlSelect {
            id: colorSelect

            label: "Cor (Catppuccin)"
            model: ["mauve", "lavender", "blue", "sapphire", "sky", "teal", "green", "yellow", "peach", "maroon", "red", "pink", "flamingo", "rosewater"]
            currentIndex: 0
        },
        PlaygroundCtrlSelect {
            id: sizeSelect

            label: "Tamanho"
            model: ["sm", "md", "lg"]
            currentIndex: 1
        },
        PlaygroundCtrlSwitch {
            id: disabledSwitch

            label: "Desativado"
        },
        PlaygroundCtrlSwitch {
            id: loadingSwitch

            label: "Carregando"
        },
        PlaygroundCtrlSwitch {
            id: expandSwitch

            label: "Expandir (Full Width)"
        }
    ]
}
