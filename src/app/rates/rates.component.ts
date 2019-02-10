import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Rate } from './rates';
import { RatesService } from './rates.service';
import { DialogRate } from './dialog/dialog.rates.component';
import { DialogConfirm } from '../components/dialog.confirm/dialog.confirm.component';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  providers: [RatesService],
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {
  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  rates: Rate[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogConfirm: MatDialog,
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
    const dialogConfirm = this.dialog.open(DialogConfirm);
    dialogConfirm.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.ratesService.deleteRate(id).subscribe(
          (res): void => {
            const { success, message } = res;
            if (success) {
              this.getData();
              this.openSnackBar({
                message,
                action: 'Exit'
              });
            } else {
              this.openSnackBar({
                message: res.errors.errors,
                time: 3000,
                action: 'Exit'
              });
            }
          },
          err => console.log(err)
        );
      }
    });
  }
}
