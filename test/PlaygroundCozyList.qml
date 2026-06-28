import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "CozyList"
    description: "Lista coesa com modelo de dados e template rowContent."

    componentItem: [
        DS.CozyList {
            anchors.fill: parent
            anchors.margins: DS.Theme.spacing.xl

            model: [
                { title: "Introdução", desc: "Primeiros passos" },
                { title: "Componentes", desc: "Visão geral do DS" },
                { title: "Temas", desc: "Personalização de cores" },
                { title: "Exemplos", desc: "Casos de uso reais" }
            ]

            rowContent: Row {
                spacing: DS.Theme.spacing.md
                anchors.verticalCenter: parent.verticalCenter
                anchors.left: parent.left
                anchors.leftMargin: DS.Theme.spacing.md

                DS.LucideIcon { name: "file-text"; size: 20; color: DS.Theme.colors.primary }

                Column {
                    spacing: 2
                    anchors.verticalCenter: parent.verticalCenter
                    Text {
                        text: modelData.title
                        font.family: DS.Theme.typography.familyMedium
                        font.pixelSize: DS.Theme.typography.sizeMd
                        color: DS.Theme.colors.text
                    }
                    Text {
                        text: modelData.desc
                        font.family: DS.Theme.typography.family
                        font.pixelSize: DS.Theme.typography.sizeXs
                        color: DS.Theme.colors.subtext0
                    }
                }
            }
        }
    ]

    controls: []
}
