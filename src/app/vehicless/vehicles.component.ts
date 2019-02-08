import { Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";

import { Vehicle } from "./vehicles";
import { VehiclesService } from "./vehicles.service";
import * as _ from "lodash";
import { DialogVehicle } from "./dialog/dialog.vehicles.component";

@Component({
  selector: "app-vehicles",
  templateUrl: "./vehicles.component.html",
  providers: [VehiclesService],
  styleUrls: ["./vehicles.component.css"]
})
export class VehiclesComponent implements OnInit {
  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  vehicles: Vehicle[];

  constructor(
    public dialog: MatDialog,
    private vehiclesService: VehiclesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
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
    dialogRef.componentInstance.openSnackBar = this.openSnackBar;
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
    this.vehiclesService.deleteVehicle(id).subscribe(
      (res): void => {
        const { success, message } = res;
        if (success) {
          this.openSnackBar({
            message: message,
            action: "Dance"
          });
        }
      }
    );
  }
}
