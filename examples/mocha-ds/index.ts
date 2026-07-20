import {
  QObject,
  QProperty,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml, runApp } from "@mocha/qml";

@QMLComponent({
  qml: qml`
    import QtQuick
    import MochaDS

    ApplicationWindow {
      visible: true
      width: 640
      height: 520
      color: Theme.colors.base
      title: "MochaDS Playground"

      VStack {
        anchors.fill: parent
        spacing: Theme.spacing.lg

        Text {
          text: controller.title
          font.pixelSize: Theme.typography.sizeH3
          font.bold: true
          color: Theme.colors.text
        }

        Card {
          width: parent.width
          padding: Theme.spacing.lg
          backgroundColor: Theme.colors.surface0

          Column {
            spacing: Theme.spacing.md

            Text {
              text: "Counter: " + controller.count
              font.pixelSize: Theme.typography.sizeXl
              color: Theme.colors.mauve
            }

            Row {
              spacing: Theme.spacing.sm

              Button {
                text: "-"
                variant: "outline"
                color: "red"
                onClicked: controller.decrement()
              }

              Button {
                text: "Reset"
                variant: "secondary"
                color: "green"
                onClicked: controller.reset()
              }

              Button {
                text: "+"
                color: "mauve"
                onClicked: controller.increment()
              }
            }
          }
        }

        Card {
          width: parent.width
          padding: Theme.spacing.lg
          backgroundColor: Theme.colors.surface0

          Column {
            spacing: Theme.spacing.md

            Text {
              text: "Switch: " + (controller.flag ? "ON" : "OFF")
              font.pixelSize: Theme.typography.sizeLg
              color: Theme.colors.text
            }

            Switch {
              checked: controller.flag
              size: "lg"
              onToggled: controller.toggle()
            }

            TextField {
              width: parent.width
              placeholder: "Type something..."
              text: controller.input
              size: "lg"
              onTextEdited: controller.setInput(text)
            }
          }
        }

        Row {
          spacing: Theme.spacing.sm

          Button {
            text: "Show Modal"
            color: "blue"
            onClicked: infoModal.open = true
          }

          Button {
            text: "Show Toast"
            variant: "tonal"
            color: "peach"
            onClicked: toastManager.show("Hello from MochaDS!", "info")
          }
        }

        ProgressBar {
          width: parent.width
          value: controller.progress
          showLabel: true
          label: Math.round(controller.progress * 100) + "%"
        }

        Badge {
          text: "v" + controller.version
          color: "teal"
          variant: "filled"
          customRadius: 12
        }
      }

      Modal {
        id: infoModal
        title: "About"
        onClosed: controller.modalClosed()

        Column {
          spacing: 16
          padding: 24

          Text {
            text: "Mocha Framework Demo"
            font.pixelSize: 20
            font.bold: true
            color: Theme.colors.text
          }

          Text {
            text: "This playground showcases MochaDS components built with @mocha/native + @mocha/qml."
            font.pixelSize: 14
            color: Theme.colors.subtext0
            wrapMode: Text.WordWrap
            width: 300
          }

          Button {
            text: "Close"
            color: "mauve"
            onClicked: infoModal.open = false
          }
        }
      }

      ToastManager {
        id: toastManager
      }
    }
  `,
})
class AppController extends QObject {
  @qproperty title = new QProperty("MochaDS Playground");
  @qproperty count = new QProperty(0);
  @qproperty flag = new QProperty(false);
  @qproperty input = new QProperty("");
  @qproperty progress = new QProperty(0.0);
  @qproperty version = new QProperty("0.3.0");

  increment(): void {
    debugger
    this.count.value += 1;
    this.progress.value = Math.min(1.0, this.count.value / 10);
  }

  decrement(): void {
    this.count.value -= 1;
    this.progress.value = Math.max(0.0, this.count.value / 10);
  }

  reset(): void {
    this.count.value = 0;
    this.progress.value = 0.0;
  }

  toggle(checked: boolean): void {
    this.flag.value = checked;
  }

  setInput(val: string): void {
    this.input.value = val;
  }

  modalClosed(): void {
    console.log("[App] Modal closed");
  }
}

runApp(AppController);
