import QtQuick

Item {
    id: root

    default property alias content: container.data

    property string key: ""
    property var dragData: null
    property real threshold: 8
    property real dragScale: 1.05
    property real dragOpacity: 0.9
    property real elevation: 6
    property real radius: -1

    property bool moves: false
    property int axis: Qt.XAxis | Qt.YAxis

    signal dragStarted(var data)
    signal dragEnded(var data)
    signal clicked()

    readonly property alias active: dragHandler.active
    readonly property alias hovered: hoverHandler.hovered

    implicitWidth: container.implicitWidth
    implicitHeight: container.implicitHeight
    width: implicitWidth
    height: implicitHeight

    Drag.keys: root.key ? [root.key] : []
    Drag.hotSpot.x: root.width / 2
    Drag.hotSpot.y: root.height / 2
    Drag.source: root
    Drag.active: dragHandler.active

    scale: dragHandler.active ? root.dragScale : (hoverHandler.hovered && root.enabled ? 1.02 : 1.0)
    opacity: dragHandler.active ? root.dragOpacity : 1.0
    z: dragHandler.active ? 100 : 0

    Behavior on scale {
        NumberAnimation { duration: 120; easing.type: Easing.OutBack }
    }
    Behavior on opacity {
        NumberAnimation { duration: 120 }
    }

    Item {
        id: container
        anchors.fill: parent
    }

    Rectangle {
        id: shadowRect
        anchors.fill: parent
        anchors.margins: -root.elevation
        radius: root.radius >= 0 ? root.radius + root.elevation : Theme.geometry.radiusMd + root.elevation
        color: "transparent"
        visible: dragHandler.active
        z: -1

        Rectangle {
            anchors.fill: parent
            radius: parent.radius
            color: Qt.rgba(0, 0, 0, 0.2)
        }
    }

    HoverHandler {
        id: hoverHandler
        enabled: root.enabled
    }

    DragHandler {
        id: dragHandler
        target: null
        enabled: root.enabled
        dragThreshold: root.threshold
        acceptedButtons: Qt.LeftButton
        cursorShape: active ? Qt.ClosedHandCursor : Qt.OpenHandCursor

        property real __startX: 0
        property real __startY: 0

        onActiveChanged: {
            if (active) {
                __startX = root.x
                __startY = root.y
                root.dragStarted(root.dragData)
            } else {
                Drag.drop()
                root.dragEnded(root.dragData)
            }
        }

        onTranslationChanged: {
            if (root.moves && active) {
                if (root.axis & Qt.XAxis)
                    root.x = __startX + translation.x
                if (root.axis & Qt.YAxis)
                    root.y = __startY + translation.y
            }
        }
    }
}
