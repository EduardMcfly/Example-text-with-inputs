import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher
} from '@angular/material';

import { Rate } from '../rates';
import { RatesService } from '../rates.service';
import * as _ from 'lodash';
import isNumeric from 'validator/lib/isNumeric';

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !control.valid && (control.dirty || control.touched);
  }
}

@Component({
  selector: 'dialog-rates',
  providers: [RatesService],
  templateUrl: 'dialog.rates.component.html'
})
export class DialogRate implements OnInit {
  rateForm: FormGroup;
  submitted = false;
  loading = false;
  getData: Function;
  openSnackBar: Function;
  isNew: boolean;
  heroes: Rate[];
  editRates: Rate; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogRate>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private ratesService: RatesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      rate: Rate;
      isNew: boolean;
    }
  ) {
    this.isNew = data.isNew;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    const { rate } = this.data;
    const { description = '', name = '', value = '' } = rate || {};
    this.rateForm = this.formBuilder.group({
      name: [name, Validators.required],
      description: [description, Validators.required],
      value: [
        value,
        [
          Validators.required,
          (control: AbstractControl) => {
            const val = control.value;
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
    return this.rateForm.controls;
  }

  add(): void {
    const rateForm = this.rateForm.controls;
    const { name, description, value } = rateForm;
    this.submitted = true;
    _.forEach(rateForm, control => {
      /**
       * @event realiza validaciones en todos los formularios
       */
      control.markAsTouched();
    });

    // stop here if form is invalid
    if (this.rateForm.invalid) {
      return;
    }
    this.loading = true;
    // The server will generate the id for this new hero
    const newRates: Rate = {
      name: name.value,
      description: description.value,
      value: value.value
    } as Rate;
    if (this.isNew) {
      this.ratesService.addRate(newRates).subscribe(res => {
        const { message = '', success = false } = res || {};
        if (success) {
          this.getData();
          this.openSnackBar({
            message,
            action: 'Exit'
          });
          this.closeDialog();
        }
      });
    } else {
      const { rate } = this.data;
      this.ratesService
        .updateRate({ ...newRates, id: rate.id } as Rate)
        .subscribe(res => {
          const { success, message } = res;
          if (success) {
            this.getData();
            this.openSnackBar({
              message,
              action: 'Exit'
            });
            this.closeDialog();
          }
        });
    }
  }
}
