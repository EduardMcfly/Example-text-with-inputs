import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./app.module.material";
/* import { BrowserModule } from "@angular/platform-browser"; */

import { A11yModule } from "@angular/cdk/a11y";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkStepperModule } from "@angular/cdk/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { CdkTreeModule } from "@angular/cdk/tree";
import { ScrollingModule } from "@angular/cdk/scrolling";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LayoutModule } from "@angular/cdk/layout";
import { SnackBarComponent } from "./components/snackBar";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { RatesComponent, DialogRate } from "./rates";
import { VehiclesComponent, DialogVehicle } from "./vehicless";
import { ParkingModule } from "./parking/parking.module";
import { DialogEntry, DialogExit, DialogCreateExit } from "./parking";
import { HttpErrorHandler } from "./http-error-handler.service";
import { MessageService } from "./message.service";
import { RatesService } from "./rates/rates.service";
import { CapitalizeDirective } from "./_directives/capitalize.directive";
import { PlateDirective } from "./_directives/plate.directive";
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
import { DialogConfirm } from "./components/dialog.confirm/dialog.confirm.component";
@NgModule({
  declarations: [
    AppComponent,
    RatesComponent,
    DialogRate,
    DialogVehicle,
    DialogEntry,
    DialogCreateExit,
    DialogExit,
    DialogConfirm,
    SnackBarComponent,
    VehiclesComponent,
    CapitalizeDirective,
    PlateDirective
  ],
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LayoutModule,
    AppRoutingModule,
    A11yModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    ScrollingModule,
    ParkingModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
  ],
  /* BrowserModule */
  entryComponents: [DialogRate, DialogVehicle, SnackBarComponent],
  providers: [HttpErrorHandler, MessageService, RatesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
