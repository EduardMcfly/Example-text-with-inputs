import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EntriesComponent } from './entries/entries.component';
import { ExitsComponent } from './exits/exits.component';
import { ParkingComponent } from './principal/parking.component';

const heroesRoutes: Routes = [
  {
    path: 'parking',
    component: ParkingComponent,
    children: [
      {
        path: 'entries',
        component: EntriesComponent
      },
      {
        path: 'exits',
        component: ExitsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(heroesRoutes)],
  exports: [RouterModule]
})
export class ParkingRoutingModule {}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
