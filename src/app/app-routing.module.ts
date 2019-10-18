import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "./app.module.material";
import { RouterModule, Routes } from "@angular/router";
import { ParkingComponent } from "./parking/parking.component";

const routes: Routes = [
  { path: "home", component: ParkingComponent },
  { path: "*", redirectTo: "/home", pathMatch: "full" },
  { path: "", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
  declarations: [ParkingComponent],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  exports: [RouterModule],
  providers: [DatePipe]
})
export class AppRoutingModule {}
