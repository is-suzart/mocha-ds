// test-quickjs/test-qml-entry.js
// Minimal counter app using @mocha/mobile + MochaDS components
// Bundled with esbuild → loaded by mocha-quickjs

import { createMobileApp } from "../packages/mobile/index.js";

(function () {
  "use strict";
  console.log("[test-qml] Starting MochaDS + QuickJS test...");

  const app = createMobileApp();

  const proxyId = app.createProxy();
  console.log("[test-qml] proxyId = " + proxyId);

  app.proxySetValue(proxyId, "title", "MochaDS + QuickJS");
  app.proxySetValue(proxyId, "count", 0);

  app.setContextProperty("controller", proxyId);

  // Setup _brandTheme proxy (Theme.qml references it for overrides)
  var themeProxyId = app.createProxy();
  app.setContextProperty("_brandTheme", themeProxyId);

  // QML using MochaDS components (Text, Small, Button, H1)
  const qml = [
    'import QtQuick',
    'import QtQuick.Controls',
    'import QtQuick.Layouts',
    'import MochaDS',
    '',
    'ApplicationWindow {',
    '  id: root',
    '  visible: true',
    '  width: 480',
    '  height: 320',
    '  title: "MochaDS + QuickJS"',
    '  color: Theme.colors.background',
    '',
    '  ColumnLayout {',
    '    anchors.centerIn: parent',
    '    spacing: Theme.spacing.lg',
    '',
    '    H1 {',
    '      Layout.alignment: Qt.AlignHCenter',
    '      text: controller.title',
    '    }',
    '',
    '    Small {',
    '      Layout.alignment: Qt.AlignHCenter',
    '      text: "Running on QuickJS — zero Node.js"',
    '      colorName: "subtext0"',
    '    }',
    '',
    '    RowLayout {',
    '      Layout.alignment: Qt.AlignHCenter',
    '      spacing: Theme.spacing.md',
    '',
    '      Text {',
    '        text: "Count: " + controller.count',
    '        variant: "h4"',
    '        colorName: "mauve"',
    '      }',
    '    }',
    '',
    '    RowLayout {',
    '      Layout.alignment: Qt.AlignHCenter',
    '      spacing: Theme.spacing.md',
    '',
    '      Button {',
    '        text: "+"',
    '        variant: "primary"',
    '        size: "lg"',
    '        onClicked: controller.bridgeCall("increment")',
    '      }',
    '',
    '      Button {',
    '        text: "-"',
    '        variant: "outline"',
    '        size: "lg"',
    '        onClicked: controller.bridgeCall("decrement")',
    '      }',
    '    }',
    '  }',
    '}',
  ].join("\n");

  // Point QML engine to MochaDS components (relative to CWD = project root)
  var importPath = "design-system";
  console.log("[test-qml] Import path: " + importPath);
  console.log("[test-qml] Loading QML (" + qml.length + " bytes)...");

  app._engine = 2; // engine handle from init
  var engineId = app._engine;
  var g = globalThis;
  g.__mocha_nativeEngineLoad(engineId, qml, "/", importPath);

  // Event loop — drains bridgeCalls from QML buttons
  var count = 0;
  function tick() {
    app.processEvents();

    var calls = app.proxyDrainPendingCalls(proxyId);
    for (var i = 0; i < calls.length; i++) {
      var call = calls[i];
      if (call === "increment") {
        count++;
        app.proxySetValue(proxyId, "count", count);
      } else if (call === "decrement") {
        count--;
        app.proxySetValue(proxyId, "count", count);
      }
    }

    setTimeout(tick, 8);
  }

  console.log("[test-qml] Event loop started");
  tick();
})();
