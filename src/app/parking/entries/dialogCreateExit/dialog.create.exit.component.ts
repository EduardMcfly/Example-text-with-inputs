import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher
} from '@angular/material';

import { ExitsService } from '../../exits/exits.service';
import { Exit } from '../../exits/exits';
import * as _ from 'lodash';

import { Rate } from '../../../rates/rates';
import { RatesService } from '../../../rates/rates.service';

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
  templateUrl: 'dialog.create.exit.component.html'
})
export class DialogCreateExit implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  loading = false;
  getData: () => void;
  openSnackBar: (config) => void;
  isNew: boolean;
  errorMatcher = new CrossFieldErrorMatcher();
  rates: Rate[];
  selected = -1;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateExit>,
    private formBuilder: FormBuilder,
    private ratesService: RatesService,
    private exitsService: ExitsService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id?: number;
      rate_id: number;
      entry_id: number;
      isNew: boolean;
      date_departure?: string;
      hour_departure?: string;
    }
  ) {
    this.isNew = data.isNew;
  }

  closeDialog(data = null): void {
    this.dialogRef.close(data);
  }

  ngOnInit() {
    this.getRates();
    const {
      date_departure = this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      hour_departure = this.datePipe.transform(new Date(), 'hh:mm'),
      rate_id = ''
    } = this.data;
    this.entryForm = this.formBuilder.group({
      rate: [rate_id, Validators.required],
      date_departure: [date_departure, Validators.required],
      hour_departure: [hour_departure, Validators.required]
    });
  }

  getRates() {
    this.ratesService.getRates().subscribe(rate => {
      const { data } = rate;
      this.rates = data.map((obj, key) => {
        return { ...obj, cols: 1, rows: 1 };
      });
    });
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
    if (this.isNew) {
      this.exitsService.addExit(newExit).subscribe(res => {
        const { message, success } = res;
        if (success) {
          this.getData();
          this.openSnackBar({
            message,
            action: 'Exit'
          });
          this.closeDialog(res);
        } else {
          const { errors } = res;
          this.openSnackBar({
            message: errors,
            action: 'Exit'
          });
        }
      });
    } else {
      const { id } = this.data;
      this.exitsService
        .updateExit({ ...newExit, id } as Exit)
        .subscribe(res => {
          const { message, success } = res;
          if (success) {
            this.getData();
            this.openSnackBar({
              message,
              action: 'Exit'
            });
            this.closeDialog(res);
          } else {
            const { errors } = res;
            this.openSnackBar({
              message: errors,
              action: 'Exit'
            });
          }
        });
    }
  }
}
