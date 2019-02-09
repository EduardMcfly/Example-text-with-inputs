import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { DatePipe } from "@angular/common";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";

import { Entry } from "./entries";
import { EntriesService } from "./entries.service";
import * as _ from "lodash";
import { DialogEntry } from "./dialog/dialog.entries.component";

@Component({
  selector: "app-entries",
  templateUrl: "./entries.component.html",
  providers: [EntriesService, DatePipe],
  styleUrls: ["./entries.component.css"]
})
export class EntriesComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "plate",
    "date_arrival",
    "hour_arrival",
    "place"
  ];
  dataSource: MatTableDataSource<Entry>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */
  entries: Entry[];

  constructor(
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private entriesService: EntriesService,
    private snackBar: MatSnackBar
  ) {
    // Assign the data to the data source for the table to render
  }

  ngOnInit() {
    this.getData();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getData() {
    this.entriesService.getEntries().subscribe(entry => {
      const { data } = entry;
      this.entries = data.map((obj, key) => {
        return {
          ...obj,
          hour_arrival: this.datePipe.transform(
            obj.hour_arrival,
            "hh:mm",
            "UTC"
          )
        };
      });
      this.dataSource = new MatTableDataSource(this.entries);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(data) {
    const dialogRef = this.dialog.open(DialogEntry, {
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
    this.entriesService.deleteEntry(id).subscribe(
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