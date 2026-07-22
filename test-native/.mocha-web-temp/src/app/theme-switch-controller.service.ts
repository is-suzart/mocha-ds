import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeSwitchControllerService {
  readonly currentTheme = signal("Dark");
  toggleTheme() {
    // TODO: migrate from QML bridgeCall
    console.log("[ThemeSwitchControllerService] toggleTheme called");
  }
  inspect() {
    // TODO: migrate from QML bridgeCall
    console.log("[ThemeSwitchControllerService] inspect called");
  }
  logQmlState() {
    // TODO: migrate from QML bridgeCall
    console.log("[ThemeSwitchControllerService] logQmlState called");
  }
  startAutoToggle() {
    // TODO: migrate from QML bridgeCall
    console.log("[ThemeSwitchControllerService] startAutoToggle called");
  }
}