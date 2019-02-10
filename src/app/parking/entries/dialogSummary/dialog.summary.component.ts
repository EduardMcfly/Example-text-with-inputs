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

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !control.valid && (control.dirty || control.touched);
  }
}

@Component({
  selector: "dialog-summary",
  providers: [EntriesService, DatePipe],
  templateUrl: "dialog.summary.component.html"
})
export class DialogSummary implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  loading = false;
  getData: () => void;
  openSnackBar: (config) => void;
  isNew: boolean;
  heroes: Entry[];
  editEntries: Entry; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogSummary>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      entry: {
        place: string;
        time_entry_format: string;
        vehicle: {
          plate: string;
          brand: string;
          year: number;
        };
      };
      ammount_to_paid: string;
      total_time: number;
      discount: string;
      time_exit_format: number;
      rate: {
        value: string;
        name: string;
        description: string;
      };
    }
  ) {
    console.log(data);
    this.data = data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  // minutes to hour (and days) converter
  convertMinutes(num) {
    const d = Math.floor(num / 1440); // 60*24
    const h = Math.floor((num - d * 1440) / 60);
    const m = Math.round(num % 60);

    if (d > 0) {
      return d + " Dias, " + h + " Horas, " + m + " Minutos";
    } else {
      return h + " Horas, " + m + " Minutos";
    }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
