import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RatesComponent } from "./rates/rates.component";
import { VehiclesComponent } from "./vehicles/vehicles.component";
import { ParkingComponent } from "./parking/parking.component";

const routes: Routes = [
  { path: "rates", component: RatesComponent },
  { path: "vehicles", component: VehiclesComponent },
  { path: "parking", component: ParkingComponent },
  { path: "**", redirectTo: "/exits", pathMatch: "full" }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
