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
  /**
   *
   *
   * @private
   * @type {Options}
   * @memberof ParkingComponent
   * @description `Here the options are defined in each form.`
   */
  private options: Options = { first: ["am", "am."] };

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
            /**
             * @description
             * `Message to show when the {value} is diferent to the`
             * `array of options`
             */
            diferent: "Is Diferent"
          });
        }
        /**
         * @description `Realiza validaciones en todos los formularios`
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
