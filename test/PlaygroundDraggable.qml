import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Draggable"
    description: "Wrapper que transforma qualquer conteúdo em algo arrastável com feedback visual."

    componentItem: [
        Column {
            anchors.centerIn: parent
            spacing: DS.Theme.spacing.xl

            Text {
                text: "Arraste os blocos abaixo:"
                font.family: DS.Theme.typography.family
                font.pixelSize: DS.Theme.typography.sizeMd
                color: DS.Theme.colors.subtext0
                anchors.horizontalCenter: parent.horizontalCenter
            }

            Row {
                spacing: DS.Theme.spacing.lg
                anchors.horizontalCenter: parent.horizontalCenter

                DS.Draggable {
                    key: "card"
                    width: 160
                    height: 100
                    dragData: ({ uid: "card1", label: "Bloco A" })

                    Rectangle {
                        anchors.fill: parent
                        radius: DS.Theme.geometry.radiusMd
                        color: DS.Theme.colors.surface0
                        border.color: DS.Theme.colors.mauve
                        border.width: 2

                        Column {
                            anchors.centerIn: parent
                            spacing: 4
                            DS.LucideIcon { name: "move"; size: 24; color: DS.Theme.colors.mauve; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "Bloco A"; font.family: DS.Theme.typography.familyMedium; font.pixelSize: DS.Theme.typography.sizeMd; color: DS.Theme.colors.text; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }
                }

                DS.Draggable {
                    key: "card"
                    width: 160
                    height: 100
                    dragData: ({ uid: "card2", label: "Bloco B" })

                    Rectangle {
                        anchors.fill: parent
                        radius: DS.Theme.geometry.radiusMd
                        color: DS.Theme.colors.surface0
                        border.color: DS.Theme.colors.blue
                        border.width: 2

                        Column {
                            anchors.centerIn: parent
                            spacing: 4
                            DS.LucideIcon { name: "move"; size: 24; color: DS.Theme.colors.blue; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "Bloco B"; font.family: DS.Theme.typography.familyMedium; font.pixelSize: DS.Theme.typography.sizeMd; color: DS.Theme.colors.text; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }
                }

                DS.Draggable {
                    key: "card"
                    width: 160
                    height: 100
                    dragData: ({ uid: "card3", label: "Bloco C" })

                    Rectangle {
                        anchors.fill: parent
                        radius: DS.Theme.geometry.radiusMd
                        color: DS.Theme.colors.surface0
                        border.color: DS.Theme.colors.green
                        border.width: 2

                        Column {
                            anchors.centerIn: parent
                            spacing: 4
                            DS.LucideIcon { name: "move"; size: 24; color: DS.Theme.colors.green; anchors.horizontalCenter: parent.horizontalCenter }
                            Text { text: "Bloco C"; font.family: DS.Theme.typography.familyMedium; font.pixelSize: DS.Theme.typography.sizeMd; color: DS.Theme.colors.text; anchors.horizontalCenter: parent.horizontalCenter }
                        }
                    }
                }
            }

            DS.DropZone {
                id: cardDropZone
                key: "card"
                width: 500
                height: 80
                anchors.horizontalCenter: parent.horizontalCenter

                Rectangle {
                    anchors.fill: parent
                    color: "transparent"
                    radius: DS.Theme.geometry.radiusMd
                    border.color: cardDropZone.containsDrag ? DS.Theme.colors.mauve : DS.Theme.colors.surface0
                    border.width: 2


                    Text {
                        text: cardDropZone.containsDrag ? "🔥 Solte aqui!" : "⬇ Zona de Drop"
                        font.family: DS.Theme.typography.family
                        font.pixelSize: DS.Theme.typography.sizeMd
                        color: cardDropZone.containsDrag ? DS.Theme.colors.mauve : DS.Theme.colors.subtext0
                        anchors.centerIn: parent
                    }
                }

                onDropped: function(source) {
                    console.log("Drop recebido:", JSON.stringify(source.dragData))
                }
            }
        }
    ]

    controls: []
}
