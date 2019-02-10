import { Component, Inject, OnInit, Directive } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher
} from "@angular/material";

import { Exit } from "../exits";
import { ExitsService } from "../exits.service";
import * as _ from "lodash";

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !control.valid && (control.dirty || control.touched);
  }
}

@Component({
  selector: "dialog-exits",
  providers: [ExitsService],
  templateUrl: "dialog.exits.component.html"
})
export class DialogExit implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  loading = false;
  getData: Function;
  openSnackBar: Function;
  isNew: boolean;
  heroes: Exit[];
  editExits: Exit; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogExit>,
    private formBuilder: FormBuilder,
    private exitsService: ExitsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entry: Exit;
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
    const { entry } = this.data;
    const { date_departure = "", hour_departure = "" } = entry || {};
    this.entryForm = this.formBuilder.group({
      date_departure: [date_departure, Validators.required],
      hour_departure: [hour_departure]
    });

    // get return url from route parameters or default to '/'
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.entryForm.controls;
  }

  add(): void {
    const entryForm = this.entryForm.controls;
    const { plate, date_departure, place, hour_departure } = entryForm;
    this.submitted = true;
    _.forEach(entryForm, control => {
      /**
       * @event realiza validaciones en todos los formularios
       */
      control.markAsTouched();
    });

    // stop here if form is invalid
    if (this.entryForm.invalid) {
      return;
    }
    this.loading = true;
    // The server will geneentry the id for this new hero
    const newExits: Exit = {
      date_departure: date_departure.value,
      hour_departure: hour_departure.value
    } as Exit;
    if (this.isNew) {
      this.exitsService.addExit(newExits).subscribe(res => {
        const { message, success } = res;
        if (success) {
          this.openSnackBar({
            message,
            action: "Exit"
          });
          this.closeDialog();
          this.getData();
        } else {
          const { errors } = res;
          this.openSnackBar({
            message: errors,
            action: "Exit"
          });
        }
      });
    } else {
      const { entry } = this.data;
      this.exitsService
        .updateExit({ ...newExits, id: entry.id } as Exit)
        .subscribe(res => {
          const { success, message } = res;
          if (success) {
            this.openSnackBar({
              message,
              action: "Exit"
            });
            this.closeDialog();
            this.getData();
          }
        });
    }
  }
}
