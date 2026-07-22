// test-quickjs/test-qml-entry.js
// Minimal counter app — imports NativeApp from @mocha/mobile via relative path
// Bundled with esbuild → loaded by mocha-quickjs

import { createMobileApp } from "../packages/mobile/index.js";

(function () {
  "use strict";
  console.log("[test-qml] Starting QML window test...");

  const app = createMobileApp();

  // Create proxy for controller properties
  const proxyId = app.createProxy();
  console.log("[test-qml] proxyId = " + proxyId);

  // Set initial values
  app.proxySetValue(proxyId, "message", "Hello from QuickJS!");
  app.proxySetValue(proxyId, "count", 0);

  // Set proxy as context property visible in QML
  app.setContextProperty("controller", proxyId);

  // Minimal QML with Window + Text bound to controller properties
  const qml = [
    'import QtQuick',
    'import QtQuick.Controls',
    '',
    'ApplicationWindow {',
    '  id: root',
    '  visible: true',
    '  width: 500',
    '  height: 300',
    '  title: "Mocha QuickJS Test"',
    '  color: "#1a1a2e"',
    '',
    '  Column {',
    '    anchors.centerIn: parent',
    '    spacing: 16',
    '',
    '    Text {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      text: controller.message',
    '      font.pixelSize: 28',
    '      color: "#e0e0e0"',
    '    }',
    '',
    '    Text {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      text: "Count: " + controller.count',
    '      font.pixelSize: 20',
    '      color: "#a0a0ff"',
    '    }',
    '',
    '    Row {',
    '      anchors.horizontalCenter: parent.horizontalCenter',
    '      spacing: 12',
    '',
    '      Button {',
    '        text: "-"',
    '        width: 60',
    '        onClicked: controller.bridgeCall("decrement")',
    '      }',
    '',
    '      Button {',
    '        text: "+"',
    '        width: 60',
    '        onClicked: controller.bridgeCall("increment")',
    '      }',
    '    }',
    '  }',
    '}',
  ].join("\n");

  console.log("[test-qml] Loading QML (" + qml.length + " bytes)...");
  app.loadQML(qml, "/");

  // Event loop: periodically update counter and drain bridge calls
  var count = 0;
  function tick() {
    app.processEvents();

    // Drain bridgeCalls from QML buttons
    var calls = app.proxyDrainPendingCalls(proxyId);
    for (var i = 0; i < calls.length; i++) {
      var call = calls[i];
      console.log("[test-qml] bridgeCall: " + call);
      if (call === "increment") {
        count++;
        app.proxySetValue(proxyId, "count", count);
      } else if (call === "decrement") {
        count--;
        app.proxySetValue(proxyId, "count", count);
      }
    }

    // Update message every 50 ticks (~400ms)
    if (count % 50 === 0) {
      app.proxySetValue(proxyId, "message", "Ticks: " + count);
    }

    count++;
    setTimeout(tick, 8);
  }

  console.log("[test-qml] Entering event loop...");
  tick();
})();
