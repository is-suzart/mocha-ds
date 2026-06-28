import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Tag"
    description: "Chips/Tags para filtros, labels e categorias com suporte a remoção."

    componentItem: [
        Column {
            spacing: DS.Theme.spacing.xl
            anchors.centerIn: parent

            Row {
                spacing: DS.Theme.spacing.sm
                DS.Tag { text: "React"; color: "blue"; icon: "code"; variant: variantSelect.model[variantSelect.currentIndex] }
                DS.Tag { text: "TypeScript"; color: "sapphire"; icon: "file-text"; variant: variantSelect.model[variantSelect.currentIndex] }
                DS.Tag { text: "QML"; color: "green"; icon: "layout"; variant: variantSelect.model[variantSelect.currentIndex] }
            }

            Row {
                spacing: DS.Theme.spacing.sm
                DS.Tag { text: "Importante"; color: "red"; removable: true; variant: variantSelect.model[variantSelect.currentIndex] }
                DS.Tag { text: "Design"; color: "mauve"; removable: true; variant: variantSelect.model[variantSelect.currentIndex] }
                DS.Tag { text: "Backlog"; color: "yellow"; removable: true; variant: variantSelect.model[variantSelect.currentIndex] }
            }

            Row {
                spacing: DS.Theme.spacing.sm
                DS.Tag { text: "Selecionado"; color: "teal"; selected: true; variant: variantSelect.model[variantSelect.currentIndex] }
                DS.Tag { text: "Normal"; color: "peach"; variant: variantSelect.model[variantSelect.currentIndex] }
                DS.Tag { text: "Ícone"; color: "sky"; icon: "star"; variant: variantSelect.model[variantSelect.currentIndex] }
            }
        }
    ]

    controls: [
        PlaygroundCtrlSelect {
            id: variantSelect
            label: "Variante"
            model: ["tonal", "filled", "outline"]
            currentIndex: 0
        }
    ]
}
