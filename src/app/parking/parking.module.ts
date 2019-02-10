import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EntriesComponent } from './entries/entries.component';
import { DialogEntry } from './entries/dialog/dialog.entries.component';
import { ExitsComponent } from './exits/exits.component';
import { DialogExit } from './exits/dialog/dialog.exits.component';
import { ParkingComponent } from './principal/parking.component';
import { DialogCreateExit } from './entries/dialogCreateExit/dialog.create.exit.component';
import { DialogSummary } from './entries/dialogSummary/dialog.summary.component';

import { ParkingRoutingModule } from './parking-routing.module';
import { MaterialModule } from '../app.module.material';
import { DialogConfirm } from '../components/dialog.confirm/dialog.confirm.component';

@NgModule({
  imports: [CommonModule, FormsModule, ParkingRoutingModule, MaterialModule],
  entryComponents: [
    DialogEntry,
    DialogExit,
    DialogCreateExit,
    DialogConfirm,
    DialogSummary
  ],
  declarations: [EntriesComponent, ParkingComponent, ExitsComponent]
})
export class ParkingModule {}
