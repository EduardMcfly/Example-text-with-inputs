import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EntriesComponent, ExitsComponent, DialogEntry, DialogExit } from "./";
import { ParkingComponent } from "./principal/parking.component";

import { ParkingRoutingModule } from "./parking-routing.module";
import { MaterialModule } from "../app.module.material";

@NgModule({
  imports: [CommonModule, FormsModule, ParkingRoutingModule, MaterialModule],
  entryComponents: [DialogEntry, DialogExit],
  declarations: [EntriesComponent, ParkingComponent, ExitsComponent]
})
export class ParkingModule {}
