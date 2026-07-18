import {
  QObject,
  QProperty,
  qproperty,
  Injectable,
} from "@mocha/core";
import { QMLComponent, qml, runApp } from "@mocha/qml";

// ── Global state (persists across routes) ──

@QMLComponent({
  providedIn: "root",
  qml: qml``,
})
@Injectable()
export class CounterState extends QObject {
  @qproperty count = new QProperty(0);

  increment() {
    this.count.value += 1;
  }

  reset() {
    this.count.value = 0;
  }
}

// ── Main app ──

@QMLComponent({
  autoBind: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS
    import QtQuick.Window 2.15

    Window {
      id: root
      width: 500
      height: 400
      visible: true
      title: "Bridge Test"
      color: Theme.colors.base

      Router {
        id: router
        initialRoute: "/home"
        anchors.fill: parent

        Route {
          path: "/home"
          view: Component {
            VStack {
              anchors.centerIn: parent
              spacing: Theme.spacing.xl
              alignItems: "center"

              Text {
                text: "Bridge Test"
                font.pixelSize: Theme.typography.sizeH2
                font.bold: true
                color: Theme.colors.text
              }

              Text {
                text: "App count: " + controller.count.value
                font.pixelSize: Theme.typography.sizeXl
                color: Theme.colors.mauve
              }

              Text {
                text: "Global count: " + CounterState.get("count")
                font.pixelSize: Theme.typography.sizeLg
                color: Theme.colors.green
              }

              HStack {
                spacing: Theme.spacing.md

                Button {
                  text: "App +1"
                  color: "mauve"
                  onClicked: controller.__call("increment")
                }

                Button {
                  text: "Global +1"
                  color: "green"
                  onClicked: CounterState.__call("increment")
                }

                Button {
                  text: "Reset"
                  variant: "secondary"
                  onClicked: {
                    controller.__call("reset")
                    CounterState.__call("reset")
                  }
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

        Route {
          path: "/about"
          view: Component {
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
                // Global count persists across routes!
                text: "Global count still: " + CounterState.get("count")
                font.pixelSize: Theme.typography.sizeLg
                color: Theme.colors.green
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
  `,
})
export class AppController extends QObject {
  @qproperty count = new QProperty(0);

  increment() {
    this.count.value += 1;
  }

  reset() {
    this.count.value = 0;
  }
}

runApp(AppController);
