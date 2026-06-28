import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Switch"
    description: "Controle liga/desliga com animação de slide."

    componentItem: [
        Column {
            spacing: DS.Theme.spacing.xl
            anchors.centerIn: parent

            DS.Switch {
                checked: false
                label: "Notificações"
                size: sizeSelect.model[sizeSelect.currentIndex]
            }

            DS.Switch {
                checked: true
                label: "Modo escuro"
                size: sizeSelect.model[sizeSelect.currentIndex]
            }

            DS.Switch {
                checked: false
                disabled: disabledSwitch.checked
                label: "Modo avião"
                size: sizeSelect.model[sizeSelect.currentIndex]
            }
        }
    ]

    controls: [
        PlaygroundCtrlSelect {
            id: sizeSelect
            label: "Tamanho"
            model: ["sm", "md", "lg"]
            currentIndex: 1
        },
        PlaygroundCtrlSwitch {
            id: disabledSwitch
            label: "Desabilitado"
        }
    ]
}
