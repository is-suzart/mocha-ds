import QtQuick

Item {
    id: root

    property int duration: 350
    property int delay: 0
    property real fromScale: 0.8
    property bool trigger: true

    default property alias data: container.data

    implicitWidth: container.implicitWidth
    implicitHeight: container.implicitHeight
    width: implicitWidth
    height: implicitHeight

    opacity: 0
    scale: root.fromScale

    Behavior on opacity {
        NumberAnimation {
            duration: root.duration
            easing.type: Easing.OutQuad
        }
    }

    Behavior on scale {
        NumberAnimation {
            duration: root.duration
            easing.type: Easing.OutBack
        }
    }

    transformOrigin: Item.Center

    Item {
        id: container
        anchors.fill: parent
    }

    onTriggerChanged: {
        if (trigger) zoomIn()
    }

    function zoomIn() {
        if (delay > 0) {
            zoomTimer.restart()
        } else {
            root.opacity = 1
            root.scale = 1
        }
    }

    Timer {
        id: zoomTimer
        interval: root.delay
        repeat: false
        onTriggered: {
            root.opacity = 1
            root.scale = 1
        }
    }

    Component.onCompleted: {
        if (trigger) Qt.callLater(zoomIn)
    }
}
