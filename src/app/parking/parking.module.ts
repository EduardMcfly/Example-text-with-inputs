import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EntrysComponent } from "./";
import { ParkingComponent } from "./principal/parking.component";

import { ParkingRoutingModule } from "./parking-routing.module";
import { materialModule } from "../app.module.material";

@NgModule({
  imports: materialModule.concat([
    CommonModule,
    FormsModule,
    ParkingRoutingModule
  ]),
  declarations: [EntrysComponent, ParkingComponent]
})
export class ParkingModule {}
