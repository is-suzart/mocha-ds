import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import ".." as DS

Playground {
    id: pg
    title: "Kanban Board"
    description: "Multi-lista com drag & drop entre colunas (Kanban)."

    componentItem: [
        Item {
            id: kanbanRoot
            anchors.fill: parent
            anchors.margins: DS.Theme.spacing.md

            property var modelTodo: [
                { label: "Definir escopo", icon: "file-text" },
                { label: "Coletar requisitos", icon: "clipboard-list" },
                { label: "Criar wireframes", icon: "pen-tool" },
                { label: "Setup do projeto", icon: "box" },
                { label: "Design system", icon: "palette" }
            ]

            property var modelDoing: [
                { label: "Componentes base", icon: "layers" },
                { label: "Sistema de temas", icon: "droplet" },
                { label: "Drag & Drop", icon: "move" },
                { label: "Testes unitários", icon: "check-square" }
            ]

            property var modelDone: [
                { label: "Documentação", icon: "book-open" },
                { label: "Playgrounds", icon: "play-circle" },
                { label: "Deploy", icon: "upload-cloud" }
            ]

            property var models: [modelTodo, modelDoing, modelDone]

            property var listIds: ["todo", "doing", "done"]
            property var columnTitles: ["📋 A Fazer", "⚡ Em Progresso", "✅ Concluído"]
            property var columnIcons: ["clipboard", "zap", "check-circle"]

            function moveItem(sourceId, sourceIndex, targetId, insertIndex) {
                var srcIdx = listIds.indexOf(sourceId)
                var tgtIdx = listIds.indexOf(targetId)
                if (srcIdx < 0 || tgtIdx < 0 || sourceIndex < 0) return
                
                // Cópia profunda dos modelos para forçar reatividade
                var newModels = [models[0].slice(), models[1].slice(), models[2].slice()]
                
                var data = newModels[srcIdx][sourceIndex]
                newModels[srcIdx].splice(sourceIndex, 1)
                
                if (insertIndex >= 0 && insertIndex <= newModels[tgtIdx].length) {
                    newModels[tgtIdx].splice(insertIndex, 0, data)
                } else {
                    newModels[tgtIdx].push(data)
                }
                
                kanbanRoot.models = newModels
            }

            RowLayout {
                anchors.fill: parent
                spacing: DS.Theme.spacing.md

                Repeater {
                    model: 3

                    ColumnLayout {
                        id: colLayout
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        spacing: DS.Theme.spacing.sm

                        property int columnIndex: index

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 44
                            radius: DS.Theme.geometry.radiusMd
                            color: DS.Theme.colors.surface0

                            RowLayout {
                                anchors.fill: parent
                                anchors.leftMargin: DS.Theme.spacing.md
                                anchors.rightMargin: DS.Theme.spacing.md
                                spacing: DS.Theme.spacing.sm

                                DS.LucideIcon {
                                    name: kanbanRoot.columnIcons[index]
                                    size: 18
                                    color: DS.Theme.colors.primary
                                }

                                Text {
                                    text: kanbanRoot.columnTitles[index]
                                    font.family: DS.Theme.typography.familyBold
                                    font.pixelSize: DS.Theme.typography.sizeMd
                                    color: DS.Theme.colors.text
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: kanbanRoot.models[index].length
                                    font.family: DS.Theme.typography.familyMedium
                                    font.pixelSize: DS.Theme.typography.sizeSm
                                    color: DS.Theme.colors.subtext0
                                }
                            }
                        }

                        DS.DropZone {
                            id: columnDropZone
                            key: "mochads-sortable"
                            accentColor: DS.Theme.colors.primary
                            Layout.fillWidth: true
                            Layout.fillHeight: true
                            radius: DS.Theme.geometry.radiusMd
                            forceHighlight: sortableList.dragTargetIndex >= 0

                            DS.SortableList {
                                id: sortableList
                                anchors.fill: parent
                                anchors.margins: DS.Theme.spacing.xs
                                listId: kanbanRoot.listIds[index]
                                sortable: true
                                model: kanbanRoot.models[index]
                                spacing: DS.Theme.spacing.xs

                                delegate: Item {
                                    width: parent.width
                                    height: 44

                                    Rectangle {
                                        anchors.fill: parent
                                        anchors.leftMargin: DS.Theme.spacing.xs
                                        anchors.rightMargin: DS.Theme.spacing.xs
                                        color: DS.Theme.colors.base
                                        radius: DS.Theme.geometry.radiusSm
                                        border.color: DS.Theme.colors.surface1
                                        border.width: 1

                                        Row {
                                            anchors.fill: parent
                                            anchors.leftMargin: DS.Theme.spacing.sm
                                            spacing: DS.Theme.spacing.sm

                                            DS.LucideIcon {
                                                name: "grip-vertical"
                                                size: 16
                                                color: DS.Theme.colors.overlay0
                                                anchors.verticalCenter: parent.verticalCenter
                                            }

                                            DS.LucideIcon {
                                                name: typeof modelData !== "undefined" && modelData ? modelData.icon : ""
                                                size: 16
                                                color: DS.Theme.colors.primary
                                                anchors.verticalCenter: parent.verticalCenter
                                            }

                                            Text {
                                                text: typeof modelData !== "undefined" && modelData ? modelData.label : ""
                                                font.family: DS.Theme.typography.familyMedium
                                                font.pixelSize: DS.Theme.typography.sizeSm
                                                color: DS.Theme.colors.text
                                                anchors.verticalCenter: parent.verticalCenter
                                                elide: Text.ElideRight
                                                width: parent.width - 60
                                            }
                                        }
                                    }
                                }

                                onItemsReordered: function(fromIndex, toIndex) {
                                    var srcIdx = kanbanRoot.listIds.indexOf(listId)
                                    if (srcIdx < 0) return
                                    var newModels = [kanbanRoot.models[0].slice(), kanbanRoot.models[1].slice(), kanbanRoot.models[2].slice()]
                                    var item = newModels[srcIdx].splice(fromIndex, 1)[0]
                                    newModels[srcIdx].splice(toIndex, 0, item)
                                    kanbanRoot.models = newModels
                                }

                                onExternalItemDropped: function(source, insertIndex) {
                                    var srcId = source.__sourceListId
                                    var srcIndex = source.__sourceIndex
                                    var tgtId = sortableList.listId
                                    if (srcId && srcIndex >= 0 && srcId !== tgtId) {
                                        kanbanRoot.moveItem(srcId, srcIndex, tgtId, insertIndex)
                                    }
                                }
                            }

                            onDropped: function(source) {
                                var srcId = source.__sourceListId
                                var srcIndex = source.__sourceIndex
                                var tgtId = sortableList.listId
                                if (srcId && srcIndex >= 0 && srcId !== tgtId) {
                                    kanbanRoot.moveItem(srcId, srcIndex, tgtId, -1)
                                }
                            }
                        }
                    }
                }
            }
        }
    ]

    controls: []
}
