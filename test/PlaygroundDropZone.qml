import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "DropZone"
    description: "Zona de drop com highlight visual ao receber itens arrastáveis."

    componentItem: [
        Column {
            anchors.centerIn: parent
            spacing: DS.Theme.spacing.xl

            Text {
                text: "Arraste os cards sobre as zonas:"
                font.family: DS.Theme.typography.family
                font.pixelSize: DS.Theme.typography.sizeMd
                color: DS.Theme.colors.subtext0
                anchors.horizontalCenter: parent.horizontalCenter
            }

            Row {
                spacing: DS.Theme.spacing.lg
                anchors.horizontalCenter: parent.horizontalCenter

                DS.Draggable {
                    key: "zone"
                    width: 120; height: 80
                    dragData: ({ uid: "item1" })
                    DS.Card {
                        anchors.fill: parent
                        variant: "tonal"
                        title: "Item 1"
                        icon: "move"
                    }
                }
                DS.Draggable {
                    key: "zone"
                    width: 120; height: 80
                    dragData: ({ uid: "item2" })
                    DS.Card {
                        anchors.fill: parent
                        variant: "tonal"
                        title: "Item 2"
                        icon: "move"
                    }
                }
                DS.Draggable {
                    key: "zone"
                    width: 120; height: 80
                    dragData: ({ uid: "item3" })
                    DS.Card {
                        anchors.fill: parent
                        variant: "tonal"
                        title: "Item 3"
                        icon: "move"
                    }
                }
            }

            Row {
                spacing: DS.Theme.spacing.lg
                anchors.horizontalCenter: parent.horizontalCenter

                DS.DropZone {
                    id: greenZone
                    key: "zone"
                    width: 180; height: 100
                    accentColor: DS.Theme.colors.green

                    Rectangle {
                        anchors.centerIn: parent
                        color: "transparent"
                        Text {
                            text: "✅ Zona Verde"
                            font.family: DS.Theme.typography.family
                            font.pixelSize: DS.Theme.typography.sizeSm
                            color: greenZone.containsDrag ? DS.Theme.colors.green : DS.Theme.colors.subtext0
                            anchors.centerIn: parent
                        }
                    }
                }

                DS.DropZone {
                    id: redZone
                    key: "zone"
                    width: 180; height: 100
                    accentColor: DS.Theme.colors.red

                    Rectangle {
                        anchors.centerIn: parent
                        color: "transparent"
                        Text {
                            text: "❌ Zona Vermelha"
                            font.family: DS.Theme.typography.family
                            font.pixelSize: DS.Theme.typography.sizeSm
                            color: redZone.containsDrag ? DS.Theme.colors.red : DS.Theme.colors.subtext0
                            anchors.centerIn: parent
                        }
                    }
                }

                DS.DropZone {
                    id: blueZone
                    key: "zone"
                    width: 180; height: 100
                    accentColor: DS.Theme.colors.blue

                    Rectangle {
                        anchors.centerIn: parent
                        color: "transparent"
                        Text {
                            text: "🔵 Zona Azul"
                            font.family: DS.Theme.typography.family
                            font.pixelSize: DS.Theme.typography.sizeSm
                            color: blueZone.containsDrag ? DS.Theme.colors.blue : DS.Theme.colors.subtext0
                            anchors.centerIn: parent
                        }
                    }
                }
            }
        }
    ]

    controls: []
}
