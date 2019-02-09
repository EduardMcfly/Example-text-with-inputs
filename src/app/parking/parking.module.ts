import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  EntriesComponent,
  ExitsComponent,
  DialogEntry,
  DialogExit,
  DialogCreateExit
} from './';
import { ParkingComponent } from './principal/parking.component';

import { ParkingRoutingModule } from './parking-routing.module';
import { MaterialModule } from '../app.module.material';
import { DialogConfirm } from '../components/dialog.confirm/dialog.confirm.component';

@NgModule({
  imports: [CommonModule, FormsModule, ParkingRoutingModule, MaterialModule],
  entryComponents: [DialogEntry, DialogExit, DialogCreateExit, DialogConfirm],
  declarations: [EntriesComponent, ParkingComponent, ExitsComponent]
})
export class ParkingModule {}
