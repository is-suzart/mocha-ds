import { QObject } from "@mocha/core";
import { getQMLComponentMetadata, generateQMLSource } from "./qml-component.js";

export interface RunAppOptions {
  basePath?: string;
  onReady?: () => void;
}

export async function runApp<T extends QObject>(
  componentClass: new (...args: any[]) => T,
  options?: RunAppOptions
): Promise<void> {
  const meta = getQMLComponentMetadata(componentClass);
  if (!meta) {
    throw new Error(
      `No QML metadata found for "${componentClass.name}". ` +
      "Did you forget the @QMLComponent decorator?"
    );
  }

  let nativeApp: any = null;
  try {
    const { createNativeApp } = await import("@mocha/native");
    nativeApp = await createNativeApp();
  } catch {
    nativeApp = {
      loadQML: () => {},
      setProperty: () => {},
      getProperty: () => "",
      exec: () => 0,
      quit: () => {},
    };
  }

  const controller = new componentClass();
  const qmlSource = generateQMLSource(controller, meta);
  nativeApp.loadQML(qmlSource, options?.basePath || process.cwd());

  options?.onReady?.();
  nativeApp.exec();
}
