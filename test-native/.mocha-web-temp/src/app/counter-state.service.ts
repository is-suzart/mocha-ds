import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CounterStateService {
  readonly count = signal(0);
  increment() {
    // TODO: implement increment
  }
  reset() {
    // TODO: implement reset
  }
}