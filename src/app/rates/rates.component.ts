import { Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm
} from "@angular/forms";
import { map } from "rxjs/operators";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatSnackBar,
  ErrorStateMatcher
} from "@angular/material";

import { Rate } from "./rates";
import { RatesService } from "./rates.service";
import * as _ from "lodash";
import isNumeric from "validator/lib/isNumeric";

export interface DialogData {
  animal: string;
  name: string;
}

class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !control.valid && (control.dirty || control.touched);
  }
}

@Component({
  selector: "app-rates",
  templateUrl: "./rates.component.html",
  providers: [RatesService],
  styleUrls: ["./rates.component.css"]
})
export class RatesComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  cards: Rate[];

  constructor(public dialog: MatDialog, private ratesService: RatesService) {}

  setCards = cards => {
    this.cards = cards;
  };

  ngOnInit() {
    this.ratesService.getRates().subscribe(rate => {
      const { data } = rate;
      this.setCards(
        data.map((obj, key) => {
          return { ...obj, cols: 1, rows: 1 };
        })
      );
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: "dialog-rates",
  providers: [RatesService],
  templateUrl: "dialog-rates.html"
})
export class DialogOverviewExampleDialog implements OnInit {
  rateForm: FormGroup;
  returnUrl: string;
  submitted = false;
  loading = false;
  heroes: Rate[];
  editRates: Rate; // the hero currently being edited
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private ratesService: RatesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar({
    message,
    action,
    time = 1000
  }: {
    message: string;
    action: string;
    time?: number;
  }) {
    this.snackBar.open(message, action, {
      duration: time
    });
  }

  ngOnInit() {
    this.rateForm = this.formBuilder.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      value: [
        "",
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
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
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
    this.ratesService.addRate(newRates).subscribe(hero => {
      this.openSnackBar({
        message: "Se ha registro con exito",
        action: "Dance"
      });
      //return this.heroes.push(hero);
    });
  }
}
