import { QObject, QProperty } from "@mocha/core";
import { Logger } from "@mocha/shared";

const logger = new Logger("PropertyInspector");

export interface PropertySnapshot {
  timestamp: number;
  properties: Record<string, any>;
}

export class PropertyInspector {
  private _snapshots: PropertySnapshot[] = [];
  private _watchedObjects = new Map<number, QObject>();
  private _maxSnapshots = 100;

  watch(obj: QObject): void {
    this._watchedObjects.set(obj.objectId, obj);
    logger.debug(`Watching ${obj.objectName} (${obj.constructor.name})`);
  }

  unwatch(obj: QObject): void {
    this._watchedObjects.delete(obj.objectId);
  }

  getProperties(obj: QObject): Record<string, any> {
    const props: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      const value = (obj as any)[key];
      if (value instanceof QProperty) {
        props[key] = {
          type: typeof value.value,
          value: value.value,
          readable: value.meta.isReadable,
          writable: value.meta.isWritable,
        };
      } else if (typeof value !== "function" && !key.startsWith("_")) {
        props[key] = value;
      }
    }
    return props;
  }

  getProperty(obj: QObject, name: string): any {
    const value = (obj as any)[name];
    if (value instanceof QProperty) {
      return value.value;
    }
    return value;
  }

  setProperty(obj: QObject, name: string, value: any): boolean {
    const prop = (obj as any)[name];
    if (prop instanceof QProperty) {
      prop.value = value;
      return true;
    }
    return false;
  }

  snapshot(obj: QObject): PropertySnapshot {
    const snapshot: PropertySnapshot = {
      timestamp: Date.now(),
      properties: this.getProperties(obj),
    };

    this._snapshots.push(snapshot);

    if (this._snapshots.length > this._maxSnapshots) {
      this._snapshots.shift();
    }

    logger.debug(`Snapshot taken for ${obj.objectName}`);
    return snapshot;
  }

  getSnapshots(): PropertySnapshot[] {
    return [...this._snapshots];
  }

  diff(
    snapshotA: PropertySnapshot,
    snapshotB: PropertySnapshot
  ): Record<string, { from: any; to: any }> {
    const diffs: Record<string, { from: any; to: any }> = {};

    for (const key of Object.keys(snapshotA.properties)) {
      const a = snapshotA.properties[key];
      const b = snapshotB.properties[key];

      if (JSON.stringify(a) !== JSON.stringify(b)) {
        diffs[key] = { from: a, to: b };
      }
    }

    return diffs;
  }

  clearSnapshots(): void {
    this._snapshots = [];
  }

  getAllProperties(): Record<string, any> {
    const all: Record<string, any> = {};
    for (const obj of this._watchedObjects.values()) {
      all[obj.objectName] = this.getProperties(obj);
    }
    return all;
  }
}
