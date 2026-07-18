import { Signal } from "./signals.js";
import { effect, activeEffectRef } from "./reactivity.js";

export class QComputedProperty<T> {
  private _value!: T;
  private _eff: { destroy: () => void } | null = null;
  private _initialized = false;

  readonly changed = new Signal<(value: T) => void>();

  constructor(private _compute: () => T) {}

  get value(): T {
    if (!this._initialized) {
      this._initialized = true;
      this._value = this._compute();
      const prev = activeEffectRef();
      this._eff = effect(() => {
        const v = this._compute();
        if (v !== this._value) {
          this._value = v;
          this.changed.emit(v);
        }
      });
      if (prev) {
        prev.addDep(this as any);
      }
    }
    const active = activeEffectRef();
    if (active) {
      (active as any).addDep(this);
    }
    return this._value;
  }

  toString(): string {
    return String(this.value);
  }

  dispose(): void {
    this._eff?.destroy();
    this.changed.disconnect();
  }
}
