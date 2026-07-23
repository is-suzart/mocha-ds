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
    this.count.update(v=>v+1)
  }
  reset() {
    this.count.set(0)
  }
  echo() {
    // TODO: adapt from QML — references: textField
    // console.log("[MOCHA ECHO]",this.echoedText());this.textField.text=""
  }
  addItem() {
    this.items.update(items=>[...items,"item-"+(items.length+1)])
  }
  addUser() {
    this.usuarios.update(users=>[...users,{name:"Novo-"+(users.length+1),age:20+users.length}])
  }
}