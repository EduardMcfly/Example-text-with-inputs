import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher
} from "@angular/material";

import { Exit, ExitsService } from "../../exits/index";
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
  providers: [ExitsService, DatePipe],
  templateUrl: "dialog.create.exit.component.html"
})
export class DialogCreateExit implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  rates = [];
  loading = false;
  getData: Function;
  openSnackBar: Function;
  isNew: boolean;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogCreateExit>,
    private formBuilder: FormBuilder,
    private exitsService: ExitsService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entry_id: number;
    }
  ) {}

  closeDialog(data = null): void {
    this.dialogRef.close(data);
  }

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      rate: ["", Validators.required],
      date_departure: [
        this.datePipe.transform(new Date(), "yyyy-MM-dd"),
        Validators.required
      ],
      hour_departure: [
        this.datePipe.transform(new Date(), "hh:mm"),
        Validators.required
      ]
    });

    // get return url from route parameters or default to '/'
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.entryForm.controls;
  }

  addExit(): void {
    const entryForm = this.entryForm.controls;
    const { date_departure, hour_departure, rate } = entryForm;
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
    const newExit: Exit = {
      entry_id: this.data.entry_id,
      rate_id: rate.value,
      date_departure: date_departure.value,
      hour_departure: hour_departure.value
    } as Exit;
    this.exitsService.addExit(newExit).subscribe(res => {
      const { message, success } = res;
      if (success) {
        this.getData();
        this.openSnackBar({
          message: message,
          action: "Exit"
        });
        this.closeDialog(res);
      } else {
        const { errors } = res;
        this.openSnackBar({
          message: errors,
          action: "Exit"
        });
      }
    });
  }
}
