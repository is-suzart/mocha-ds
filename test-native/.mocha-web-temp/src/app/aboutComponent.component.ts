import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonComponent, IconComponent, InputComponent } from "./mocha-ds/index";
import { AppControllerService } from "./app-controller.service";

@Component({
  selector: "app-about.component",
  standalone: true,
  imports: [RouterModule, ButtonComponent, IconComponent, InputComponent],
  templateUrl: "./aboutComponent.component.html",
})
export class AboutComponent {
  ctrl = inject(AppControllerService);
}
