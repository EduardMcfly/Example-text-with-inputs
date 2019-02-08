import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { materialModule } from "./app.module.material";
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
import { DialogEntry } from "./parking";
import { HttpErrorHandler } from "./http-error-handler.service";
import { MessageService } from "./message.service";
import { RatesService } from "./rates/rates.service";
import { CapitalizeDirective } from "./_directives/capitalize.directive";

@NgModule({
  declarations: [
    AppComponent,
    RatesComponent,
    DialogRate,
    DialogVehicle,
    DialogEntry,
    SnackBarComponent,
    VehiclesComponent,
    CapitalizeDirective
  ],
  imports: materialModule.concat(
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
    ParkingModule
    /* BrowserModule */
  ),
  entryComponents: [DialogRate, DialogVehicle, SnackBarComponent],
  providers: [HttpErrorHandler, MessageService, RatesService],
  bootstrap: [AppComponent]
})
export class AppModule {}
