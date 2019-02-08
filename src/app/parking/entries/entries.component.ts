import { Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";

import { Entry } from "./entries";
import { EntrysService } from "./entries.service";
import * as _ from "lodash";
import { DialogEntry } from "./dialog/dialog.entries.component";

@Component({
  selector: "app-entries",
  templateUrl: "./entries.component.html",
  providers: [EntrysService],
  styleUrls: ["./entries.component.css"]
})
export class EntrysComponent implements OnInit {
  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  entries: Entry[];

  constructor(
    public dialog: MatDialog,
    private entriesService: EntrysService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.entriesService.getEntrys().subscribe(entry => {
      const { data } = entry;
      this.entries = data.map((obj, key) => {
        return { ...obj, cols: 1, rows: 1 };
      });
    });
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogEntry, {
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
    this.entriesService.deleteEntry(id).subscribe(
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
