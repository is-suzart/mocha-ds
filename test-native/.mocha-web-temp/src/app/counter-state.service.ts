import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CounterStateService {
  readonly count = signal(0);
  increment() {
    this.count.update(v=>v+1)
  }
  reset() {
    this.count.set(0)
  }
}