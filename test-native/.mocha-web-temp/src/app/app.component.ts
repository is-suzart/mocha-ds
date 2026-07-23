import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ButtonComponent, IconComponent, InputComponent } from "./mocha-ds/index";
import { AppControllerService } from "./app-controller.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ButtonComponent, IconComponent, InputComponent],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  ctrl = inject(AppControllerService);
}
