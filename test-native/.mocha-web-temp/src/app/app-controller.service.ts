import { Injectable, signal, inject, computed } from "@angular/core";
import { CounterStateService } from "./counter-state.service";

@Injectable({ providedIn: "root" })
export class AppControllerService {
  readonly count = signal(0);
  readonly echoedText = signal("");
  readonly items = signal(["um","dois","três"]);
  readonly usuarios = signal([{"name":"Fulano","age":30},{"name":"Ciclano","age":25}]);
  readonly itemCount = computed(() => "");
  readonly counter = inject(CounterStateService);
  increment() {
    // TODO: migrate from QML bridgeCall
    console.log("[AppControllerService] increment called");
  }
  reset() {
    // TODO: migrate from QML bridgeCall
    console.log("[AppControllerService] reset called");
  }
  echo() {
    // TODO: migrate from QML bridgeCall
    console.log("[AppControllerService] echo called");
  }
  addItem() {
    // TODO: migrate from QML bridgeCall
    console.log("[AppControllerService] addItem called");
  }
  addUser() {
    // TODO: migrate from QML bridgeCall
    console.log("[AppControllerService] addUser called");
  }
}