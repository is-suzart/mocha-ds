import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class MochaDSElementsControllerService {
  toggleTheme() {
    // TODO: migrate from QML bridgeCall
    console.log("[MochaDSElementsControllerService] toggleTheme called");
  }
}