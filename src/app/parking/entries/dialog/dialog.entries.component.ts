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

import { Entry } from "../entries";
import { EntrysService } from "../entries.service";
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
  selector: "dialog-entries",
  providers: [EntrysService],
  templateUrl: "dialog.entries.component.html"
})
export class DialogEntry implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  loading = false;
  getData: Function;
  openSnackBar: Function;
  isNew: boolean;
  heroes: Entry[];
  editEntrys: Entry; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogEntry>,
    private formBuilder: FormBuilder,
    private entriesService: EntrysService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entry: Entry;
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
    const { brand = "", plate = "", year = "" } = entry || {};
    this.entryForm = this.formBuilder.group({
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
    return this.entryForm.controls;
  }

  add(): void {
    const entryForm = this.entryForm.controls;
    const { plate, brand, year } = entryForm;
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
    const newEntrys: Entry = {
      plate: plate.value,
      brand: brand.value,
      year: year.value
    } as Entry;
    if (this.isNew) {
      this.entriesService.addEntry(newEntrys).subscribe(res => {
        const { message, success } = res;
        if (success) {
          this.openSnackBar({
            message: message,
            action: "Dance"
          });
          this.closeDialog();
          this.getData();
        }
      });
    } else {
      const { entry } = this.data;
      this.entriesService
        .updateEntry({ ...newEntrys, id: entry.id } as Entry)
        .subscribe(res => {
          const { success, message } = res;
          if (success) {
            this.openSnackBar({
              message: message,
              action: "Dance"
            });
            this.closeDialog();
            this.getData();
          }
        });
    }
  }
}
