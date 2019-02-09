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
import { DatePipe } from "@angular/common";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  ErrorStateMatcher
} from "@angular/material";

import { Entry } from "../entries";
import { EntriesService } from "../entries.service";
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
  selector: "dialog-entries",
  providers: [EntriesService, DatePipe],
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
  editEntries: Entry; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogEntry>,
    private formBuilder: FormBuilder,
    private entriesService: EntriesService,
    private datePipe: DatePipe,
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
    const {
      date_arrival = this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      plate = "",
      hour_arrival = this.datePipe.transform(new Date(), "hh:mm"),
      place = ""
    } = entry || {};
    this.entryForm = this.formBuilder.group({
      plate: [
        plate,
        [
          Validators.required,
          (control: AbstractControl) => {
            let val = control.value;
            try {
              return !/^[a-zA-Z]{3}-[0-9]{3}$/.test(val)
                ? { invalidPlate: true }
                : null;
            } catch (error) {
              return { invalidPlate: true };
            }
          }
        ]
      ],
      date_arrival: [date_arrival, Validators.required],
      place: [place, Validators.required],
      hour_arrival: [hour_arrival]
    });

    // get return url from route parameters or default to '/'
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.entryForm.controls;
  }

  add(): void {
    const entryForm = this.entryForm.controls;
    const { plate, date_arrival, place, hour_arrival } = entryForm;
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
    const newEntries: Entry = {
      plate: plate.value,
      place: place.value,
      date_arrival: date_arrival.value,
      hour_arrival: hour_arrival.value
    } as Entry;
    if (this.isNew) {
      this.entriesService.addEntry(newEntries).subscribe(res => {
        const { message, success } = res;
        if (success) {
          this.openSnackBar({
            message: message,
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
      this.entriesService
        .updateEntry({ ...newEntries, id: entry.id } as Entry)
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
