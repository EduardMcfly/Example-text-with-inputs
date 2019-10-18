import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, AbstractControl } from "@angular/forms";
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
  private separator: string = "#";
  /**
   *
   *
   * @private
   * @type {Options}
   * @memberof ParkingComponent
   * @description `Here the options are defined in each form.`
   */
  public text: string = `Lorem #ipsum, dolor sit amet consectetur adipisicing elit. 
Ex, placeat labore, error #nisi provident, dolorum quasi consequatur veritatis quod in numquam
voluptatibus a exercitationem! A reiciendis deserunt doloremque porro
dolorem.`;

  public textEnd: (string | { input: string })[] = [];
  private options: Options = { first: ["am", "am."] };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.initDynamicallyForm();
  }

  initDynamicallyForm() {
    this.textEnd = [];
    this.entryForm = this.formBuilder.group({});
    let a: RegExpExecArray;
    let text = this.text;
    const execReg = value =>
      new RegExp(`${this.separator}(\\S+)`, "g").exec(value);
    while ((a = execReg(text))) {
      const split = text.split(a[0]);
      if (split.length > 2) {
        console.log(`${a[0]}, debe ser unico`);
      } else {
        this.textEnd.push(split[0], { input: a[1] });
        if (!execReg(split[1])) this.textEnd.push(split[1]);
        this.entryForm.addControl(a[1], this.formBuilder.control(""));
      }
      text = split.join("");
    }
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

    console.log(this.entryForm);
  }

  isString(value: any) {
    return typeof value === "string";
  }
}
