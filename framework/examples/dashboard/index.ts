import {
  QObject,
  QProperty,
  QApplication,
  qproperty,
} from "@mocha/core";
import {
  QMLComponent,
  qml,
  BindingEngine,
  generateQMLSource,
  getQMLComponentMetadata,
} from "@mocha/qml";
import { DevToolsServer } from "@mocha/devtools";

@QMLComponent({
  qml: qml`
    import QtQuick 2.15

    Rectangle {
      width: 600
      height: 400
      color: "#0d1117"

      Column {
        anchors.centerIn: parent
        spacing: 16

        Text {
          id: titleText
          text: controller.title.value
          color: "#c9d1d9"
          font.pixelSize: 32
          font.bold: true
        }

        Text {
          id: counterText
          text: controller.count.value.toString()
          color: "#58a6ff"
          font.pixelSize: 64
          font.bold: true
        }

        Text {
          id: messageText
          text: controller.message.value
          color: "#8b949e"
          font.pixelSize: 18
        }

        Row {
          spacing: 12
          anchors.horizontalCenter: parent.horizontalCenter

          Button {
            text: "-"
            onClicked: controller.decrement()
          }

          Button {
            text: "Reset"
            onClicked: controller.reset()
          }

          Button {
            text: "+"
            onClicked: controller.increment()
          }
        }
      }
    }
  `,
  autoBind: true,
  hotReload: true,
})
class DashboardController extends QObject {
  @qproperty title = new QProperty("Mocha Dashboard");
  @qproperty count = new QProperty(0);
  @qproperty message = new QProperty("Click a button to start!");
  @qproperty step = new QProperty(1);

  constructor(parent: QObject | null = null) {
    super(parent);
  }

  increment(): void {
    this.count.value += this.step.value;
    this.message.value = `Incremented by ${this.step.value}`;
  }

  decrement(): void {
    this.count.value -= this.step.value;
    this.message.value = `Decremented by ${this.step.value}`;
  }

  reset(): void {
    this.count.value = 0;
    this.message.value = "Reset to zero";
  }

  setTitle(newTitle: string): void {
    this.title.value = newTitle;
  }
}

const app = new QApplication({
  appName: "Mocha QML Dashboard",
  appVersion: "0.1.0",
});

const controller = new DashboardController();
const metadata = getQMLComponentMetadata(DashboardController);

if (metadata) {
  console.log("=== Mocha QML Hybrid Example ===");
  console.log(`Component: ${metadata.componentName}`);
  console.log(`Bindings: ${Object.keys(metadata.bindings).length}`);
  console.log("");

  const qmlSource = generateQMLSource(controller, metadata);
  console.log("--- Generated QML ---");
  console.log(qmlSource);
  console.log("");

  controller.increment();
  controller.increment();
  console.log(`Count after 2 increments: ${controller.count.value}`);
  console.log(`Message: ${controller.message.value}`);

  controller.setTitle("Mocha QML Demo");
  console.log(`Title: ${controller.title.value}`);

  controller.step.value = 5;
  controller.increment();
  console.log(`Count after step=5 increment: ${controller.count.value}`);

  new BindingEngine().bindFromQMLBindings(controller, metadata.bindings);

  const devTools = new DevToolsServer({ port: 9230 });
  devTools.start();
  devTools.attach(controller);

  setTimeout(() => {
    devTools.stop();
    app.quit();
  }, 1000);
} else {
  console.log("No metadata found for component");
  app.quit();
}
