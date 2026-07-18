import {
  QObject,
  QProperty,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml, runApp } from "@mocha/qml";

@QMLComponent({
  autoBind: true,
  hotReload: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS
    import QtQuick.Window 2.15

    Window {
      id: root
      width: 600
      height: 450
      visible: true
      title: "{{project_name}}"
      color: Theme.colors.base

      property int count: 0

      Router {
        id: router
        initialRoute: "/home"
        anchors.fill: parent

        Route {
          path: "/home"
          view: Component {
            Item {
              anchors.fill: parent
              VStack {
                anchors.centerIn: parent
                spacing: Theme.spacing.xl
                alignItems: "center"

                Text {
                  text: "{{project_name}}"
                  font.pixelSize: Theme.typography.sizeH2
                  font.bold: true
                  color: Theme.colors.text
                }

                Text {
                  text: "Count: " + root.count
                  font.pixelSize: Theme.typography.sizeXl
                  color: Theme.colors.mauve
                }

                HStack {
                  spacing: Theme.spacing.md
                  Button {
                    text: "Reset"
                    variant: "secondary"
                    color: "green"
                    onClicked: root.count = 0
                  }
                  Button {
                    text: "+1"
                    color: "mauve"
                    onClicked: root.count = root.count + 1
                  }
                }

                RouterLink {
                  to: "/about"
                  text: "About"
                  icon: "info"
                }
              }
            }
          }
        }

        Route {
          path: "/about"
          view: Component {
            Item {
              anchors.fill: parent
              VStack {
                anchors.centerIn: parent
                spacing: Theme.spacing.xl
                alignItems: "center"

                Text {
                  text: "About"
                  font.pixelSize: Theme.typography.sizeH2
                  font.bold: true
                  color: Theme.colors.text
                }

                Text {
                  text: "Built with @mocha/native + MochaDS"
                  font.pixelSize: Theme.typography.sizeMd
                  color: Theme.colors.subtext0
                }

                RouterLink {
                  to: "/home"
                  text: "Home"
                  icon: "home"
                }
              }
            }
          }
        }
      }
    }
  `,
})
export class AppController extends QObject {
  @qproperty title = new QProperty("{{project_name}}");
  @qproperty count = new QProperty(0);
}

runApp(AppController);
