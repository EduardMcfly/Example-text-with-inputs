import { Component, OnInit, Input } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";

import { Exit } from "./exits";
import { ExitsService } from "./exits.service";
import * as _ from "lodash";
import { DialogExit } from "./dialog/dialog.exits.component";

@Component({
  selector: "app-exits",
  templateUrl: "./exits.component.html",
  providers: [ExitsService, DatePipe],
  styleUrls: ["./exits.component.css"]
})
export class ExitsComponent implements OnInit {
  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  exits: Exit[];

  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private exitsService: ExitsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.exitsService.getExits().subscribe(entry => {
      const { data } = entry;
      this.exits = data.map((obj, key) => {
        return {
          ...obj,
          hour_arrival: this.datePipe.transform(
            obj.hour_arrival,
            "hh:mm",
            "UTC"
          )
        };
      });
    });
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogExit, {
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
  }) {
    this.snackBar.open(message, action, {
      duration: time
    });
  }

  remove({ id }: { id: number }): void {
    this.exitsService.deleteExit(id).subscribe(
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
