import { Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";

import { Rate } from "./rates";
import { RatesService } from "./rates.service";
import * as _ from "lodash";
import { DialogRate } from "./dialog/dialog.rates.component";

@Component({
  selector: "app-rates",
  templateUrl: "./rates.component.html",
  providers: [RatesService],
  styleUrls: ["./rates.component.css"]
})
export class RatesComponent implements OnInit {
  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  rates: Rate[];

  constructor(
    public dialog: MatDialog,
    private ratesService: RatesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.ratesService.getRates().subscribe(rate => {
      const { data } = rate;
      this.rates = data.map((obj, key) => {
        return { ...obj, cols: 1, rows: 1 };
      });
    });
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogRate, {
      data: {
        ...data,
        reloadData: this.getData
      }
    });
    dialogRef.componentInstance.getData = async () => this.getData();
    dialogRef.componentInstance.openSnackBar = async obj =>
      this.openSnackBar(obj);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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

  remove({ id }: { id: number }): void {
    this.ratesService.deleteRate(id).subscribe(
      (res): void => {
        const { success, message } = res;
        if (success) {
          this.getData();
          this.openSnackBar({
            message: message,
            action: "Dance"
          });
        }
      }
    );
  }
}
