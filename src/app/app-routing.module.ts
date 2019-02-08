import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RatesComponent } from "./rates/rates.component";
import { VehiclesComponent } from "./vehicless";
import { ParkingComponent } from "./parking";

const routes: Routes = [
  { path: "rates", component: RatesComponent },
  { path: "vehicles", component: VehiclesComponent },
  { path: "parking", component: ParkingComponent },
  { path: "**", redirectTo: "/rates", pathMatch: "full" }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
