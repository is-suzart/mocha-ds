import QtQuick

Item {
    id: root

    property int duration: 300
    property int delay: 0
    property bool trigger: true

    default property alias data: container.data

    implicitWidth: container.implicitWidth
    implicitHeight: container.implicitHeight
    width: implicitWidth
    height: implicitHeight

    opacity: 0

    Behavior on opacity {
        NumberAnimation {
            duration: root.duration
            easing.type: Easing.OutQuad
        }
    }

    Item {
        id: container
        anchors.fill: parent
    }

    onTriggerChanged: {
        if (trigger) fadeIn()
    }

    function fadeIn() {
        if (delay > 0) {
            fadeTimer.restart()
        } else {
            root.opacity = 1
        }
    }

    Timer {
        id: fadeTimer
        interval: root.delay
        repeat: false
        onTriggered: root.opacity = 1
    }

    Component.onCompleted: {
        if (trigger) Qt.callLater(fadeIn)
    }
}
