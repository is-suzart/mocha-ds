import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Item {
    id: root
    
    property alias componentItem: previewContainer.data
    property alias controls: controlColumn.data
    property string title: ""
    property string description: ""

    RowLayout {
        anchors.fill: parent
        spacing: 0

        // Preview Area
        ColumnLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 0

            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 80
                color: "transparent"
                
                Column {
                    anchors.fill: parent
                    anchors.margins: DS.Theme.spacing.xl
                    spacing: DS.Theme.spacing.xs
                    
                    Text {
                        text: root.title
                        font.family: DS.Theme.typography.familyBold
                        font.pixelSize: DS.Theme.typography.sizeH2
                        color: DS.Theme.colors.text
                    }
                    Text {
                        text: root.description
                        font.family: DS.Theme.typography.family
                        font.pixelSize: DS.Theme.typography.sizeMd
                        color: DS.Theme.colors.subtext0
                    }
                }
            }

            Rectangle {
                id: previewContainer
                Layout.fillWidth: true
                Layout.fillHeight: true
                color: DS.Theme.colors.mantle
                radius: DS.Theme.geometry.radiusLg
                anchors.margins: DS.Theme.spacing.xl
                
                border.color: DS.Theme.colors.surface0
                border.width: DS.Theme.geometry.borderSm

                // The actual component will be centered here
            }
        }

        // Controls Area
        Rectangle {
            Layout.preferredWidth: 300
            Layout.fillHeight: true
            color: DS.Theme.colors.base

            Rectangle {
                anchors.left: parent.left
                width: 1
                height: parent.height
                color: DS.Theme.colors.surface0
            }

            ColumnLayout {
                anchors.fill: parent
                anchors.margins: DS.Theme.spacing.xl
                spacing: DS.Theme.spacing.lg

                Text {
                    text: "Propriedades"
                    font.family: DS.Theme.typography.familyBold
                    font.pixelSize: DS.Theme.typography.sizeLg
                    color: DS.Theme.colors.text
                }

                ScrollView {
                    id: controlScroll
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    clip: true

                    Column {
                        id: controlColumn
                        width: controlScroll.width - DS.Theme.spacing.md
                        spacing: DS.Theme.spacing.xl
                    }
                }
            }
        }
    }
}
