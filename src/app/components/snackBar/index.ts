import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'snack-bar-component-snack',
  template: `
    <mat-form-field>
      <input matInput value="Disco party!" placeholder="Message" #message />
    </mat-form-field>

    <mat-form-field>
      <input matInput value="Exit" placeholder="Action" #action />
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
export class SnackBarComponent {
  constructor(private snackBar: MatSnackBar) {}
  openSnackBar({
    message,
    action,
    time = 1000
  }: {
    message: string;
    action: string;
    time?: number;
  }): void {
    this.snackBar.open(message, action, {
      duration: time
    });
  }
}
