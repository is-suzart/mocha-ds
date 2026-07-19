import {
  QObject,
  QProperty,
  QApplication,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml } from "@mocha/qml";

@QMLComponent({
  autoBind: true,
  hotReload: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS

    Item {
      id: root
      anchors.fill: parent

      Component.onCompleted: {
        MochaI18n.basePath = Qt.resolvedUrl("i18n").toString()
        MochaI18n.locale = Qt.locale().name.substring(0, 2) === "pt" ? "pt" : "en"
      }

      VStack {
        anchors.fill: parent
        spacing: 0

        // Navigation Bar
        HStack {
          width: parent.width
          height: 64
          padding: 16
          spacing: 24

          Text {
            text: controller.title.value
            font.pixelSize: 22
            font.bold: true
            color: Theme.colors.text
            anchors.verticalCenter: parent.verticalCenter
          }

          HStack {
            spacing: 16
            anchors.verticalCenter: parent.verticalCenter

            RouterLink {
              to: "/home"
              text: "Home"
              router: mainRouter
              activeColor: Theme.colors.primary
            }

            RouterLink {
              to: "/about"
              text: "About"
              router: mainRouter
              activeColor: Theme.colors.primary
            }
          }
        }

        // Router Area
        Router {
          id: mainRouter
          width: parent.width
          height: parent.height - 64
          initialRoute: "/home"

          Route {
            path: "/home"
            source: Qt.resolvedUrl("views/Home.qml")
          }

          Route {
            path: "/about"
            source: Qt.resolvedUrl("views/About.qml")
          }
        }
      }
    }
  `,
})
export class AppController extends QObject {
  @qproperty title = new QProperty("{{project_name}}");
  @qproperty count = new QProperty(0);

  constructor(parent: QObject | null = null) {
    super(parent);
  }

  increment(): void {
    this.count.value += 1;
  }

  reset(): void {
    this.count.value = 0;
  }
}

export class Main {
  static run(): number {
    const app = new QApplication({
      appName: "{{project_name}}",
      appVersion: "0.1.0",
    });

    const controller = new AppController();
    app.exec();

    return 0;
  }
}

Main.run();
