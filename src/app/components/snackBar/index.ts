import { Component } from "@angular/core";

@Component({
  selector: "snack-bar-component-snack",
  template: `
    <mat-form-field>
      <input matInput value="Disco party!" placeholder="Message" #message />
    </mat-form-field>

    <mat-form-field>
      <input matInput value="Dance" placeholder="Action" #action />
    </mat-form-field>
  `,
  styles: [
    `
      .example-pizza-party {
        color: hotpink;
      }
    `
  ]
})
export class SnackBarComponent {}
