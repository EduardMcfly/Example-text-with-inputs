import { Component, Inject, OnInit, Directive } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher
} from "@angular/material";

import { Vehicle } from "../vehicles";
import { VehiclesService } from "../vehicles.service";
import * as _ from "lodash";
import isNumeric from "validator/lib/isNumeric";

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !control.valid && (control.dirty || control.touched);
  }
}

@Component({
  selector: "dialog-vehicles",
  providers: [VehiclesService],
  templateUrl: "dialog.vehicles.component.html"
})
export class DialogVehicle implements OnInit {
  vehicleForm: FormGroup;
  submitted = false;
  loading = false;
  getData: Function;
  openSnackBar: Function;
  isNew: boolean;
  heroes: Vehicle[];
  editVehicles: Vehicle; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogVehicle>,
    private formBuilder: FormBuilder,
    private vehiclesService: VehiclesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      vehicle: Vehicle;
      isNew: boolean;
      reloadData: Function;
    }
  ) {
    this.isNew = data.isNew;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    const { vehicle } = this.data;
    const { brand = "", plate = "", year = "" } = vehicle || {};
    this.vehicleForm = this.formBuilder.group({
      plate: [plate, Validators.required],
      brand: [brand, Validators.required],
      year: [
        year,
        [
          Validators.required,
          (control: AbstractControl) => {
            let val = control.value;
            try {
              return isNumeric(val.toString()) === false
                ? { invalidNumber: true }
                : null;
            } catch (error) {
              return { invalidNumber: true };
            }
          }
        ]
      ]
    });

    // get return url from route parameters or default to '/'
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.vehicleForm.controls;
  }

  add(): void {
    const vehicleForm = this.vehicleForm.controls;
    const { plate, brand, year } = vehicleForm;
    this.submitted = true;
    _.forEach(vehicleForm, control => {
      /**
       * @event realiza validaciones en todos los formularios
       */
      control.markAsTouched();
    });

    // stop here if form is invalid
    if (this.vehicleForm.invalid) {
      return;
    }
    this.loading = true;
    // The server will genevehicle the id for this new hero
    const newVehicles: Vehicle = {
      plate: plate.value,
      brand: brand.value,
      year: year.value
    } as Vehicle;
    if (this.isNew) {
      this.vehiclesService.addVehicle(newVehicles).subscribe(res => {
        const { message = "", success = false } = res || {};
        if (success) {
          this.openSnackBar({
            message: message,
            action: "Exit"
          });
          this.closeDialog();
          this.getData();
        }
      });
    } else {
      const { vehicle } = this.data;
      this.vehiclesService
        .updateVehicle({ ...newVehicles, id: vehicle.id } as Vehicle)
        .subscribe(res => {
          const { success, message } = res;
          if (success) {
            this.openSnackBar({
              message: message,
              action: "Exit"
            });
            this.closeDialog();
            this.getData();
          }
        });
    }
  }
}
