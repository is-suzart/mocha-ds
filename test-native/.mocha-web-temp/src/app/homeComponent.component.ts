import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonComponent, IconComponent, InputComponent } from "./mocha-ds/index";
import { AppControllerService } from "./app-controller.service";

@Component({
  selector: "app-home.component",
  standalone: true,
  imports: [RouterModule, ButtonComponent, IconComponent, InputComponent],
  templateUrl: "./homeComponent.component.html",
})
export class HomeComponent {
  ctrl = inject(AppControllerService);
}
