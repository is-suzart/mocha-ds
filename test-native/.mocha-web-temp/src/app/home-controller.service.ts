import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class HomeControllerService {
  readonly count = signal(0);
  increment() {
    // TODO: migrate from QML bridgeCall
    console.log("[HomeControllerService] increment called");
  }
  reset() {
    // TODO: migrate from QML bridgeCall
    console.log("[HomeControllerService] reset called");
  }
}