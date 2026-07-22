import { HomeComponent } from "./homeComponent.component";
import { AboutComponent } from "./aboutComponent.component";
import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "", redirectTo: "home", pathMatch: "full" },
];