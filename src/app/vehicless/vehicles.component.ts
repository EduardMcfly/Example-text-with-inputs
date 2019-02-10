import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Vehicle } from './vehicles';
import { VehiclesService } from './vehicles.service';
import { DialogVehicle } from './dialog/dialog.vehicles.component';
import { DialogConfirm } from '../components/dialog.confirm/dialog.confirm.component';
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  providers: [VehiclesService],
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  vehicles: Vehicle[] = [];

  constructor(
    public dialog: MatDialog,
    private vehiclesService: VehiclesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    this.vehiclesService.getVehicles().subscribe(vehicle => {
      const { data } = vehicle;
      this.vehicles = data.map((obj, key) => {
        return { ...obj, cols: 1, rows: 1 };
      });
    });
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogVehicle, {
      data: {
        ...data
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
  }): void {
    this.snackBar.open(message, action, {
      duration: time
    });
  }

  remove({ id }: { id: number }): void {
    const dialogRef = this.dialog.open(DialogConfirm);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.vehiclesService.deleteVehicle(id).subscribe(
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
