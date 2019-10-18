import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import * as _ from "lodash";

interface Options {
  [key: string]: string[];
}
@Component({
  selector: "app-parking",
  templateUrl: "./parking.component.html",
  styleUrls: ["./parking.component.css"]
})
export class ParkingComponent implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  loading = false;
  getData: () => void;
  openSnackBar: (config) => void;
  isNew: boolean;
  options: Options = { first: ["am", "am."] };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.entryForm = this.formBuilder.group({
      first: ""
    });

    // get return url from route parameters or default to '/'
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.entryForm.controls;
  }

  send(): void {
    const entryForm = this.entryForm.controls;
    this.submitted = true;
    for (const key in entryForm) {
      if (entryForm.hasOwnProperty(key)) {
        const control = entryForm[key];
        const value = control.value;
        const options = this.options[key];
        if (
          options &&
          !options.find(option => String(value).toLowerCase() === option)
        ) {
          control.setErrors({
            diferent: "Is Diferent"
          });
        }
        /**
         * @event realiza validaciones en todos los formularios
         */
        control.markAsTouched();
      }
    }

    if (this.entryForm.invalid) {
      return;
    }
    console.log(entryForm);
  }
}
