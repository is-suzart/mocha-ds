import {
  QObject,
  QProperty,
  qproperty,
} from "@mocha/core";
import { QMLComponent, qml } from "@mocha/qml";

@QMLComponent({
  autoBind: true,
  hotReload: true,
  qml: qml`
    import QtQuick 2.15
    import MochaDS

    VStack {
      anchors.fill: parent
      spacing: Theme.spacing.xl
      alignItems: "center"

      Text {
        text: "Home Page"
        font.pixelSize: Theme.typography.sizeH2
        font.bold: true
        color: Theme.colors.text
      }

      Text {
        text: "Count: " + controller.count.value
        font.pixelSize: Theme.typography.sizeXl
        color: Theme.colors.subtext0
      }

      HStack {
        spacing: Theme.spacing.md

        Button {
          text: "Increment"
          color: "mauve"
          onClicked: controller.increment()
        }

        Button {
          text: "Reset"
          variant: "secondary"
          color: "green"
          onClicked: controller.reset()
        }
      }
    }
  `,
})
export class HomeController extends QObject {
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
