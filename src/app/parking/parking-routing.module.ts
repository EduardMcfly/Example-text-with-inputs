import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EntrysComponent, ParkingComponent } from "./index";

const heroesRoutes: Routes = [
  {
    path: "parking",
    component: ParkingComponent
  },
  {
    path: "parking/entrys",
    component: EntrysComponent
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
