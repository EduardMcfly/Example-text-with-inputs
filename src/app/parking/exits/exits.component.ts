import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { DatePipe } from "@angular/common";
import { MatDialog, MatSnackBar } from "@angular/material";
import { Subscription } from "rxjs";

import { Exit } from "./exits";
import { ExitsService } from "./exits.service";
import * as _ from "lodash";
import { DialogExit } from "./dialog/dialog.exits.component";
import { DialogConfirm } from "../../components/dialog.confirm/dialog.confirm.component";
import { DialogCreateExit } from "../entries";

@Component({
  selector: "app-exits",
  templateUrl: "./exits.component.html",
  providers: [ExitsService, DatePipe],
  styleUrls: ["./exits.component.css"]
})
export class ExitsComponent implements OnInit {
  displayedColumns: string[] = [
    "actions",
    "plate",
    "date_arrival",
    "date_departure",
    "total_time",
    "rate_value",
    "ammount_to_paid",
    "discount",
    "place"
  ];
  dataSource: MatTableDataSource<Exit>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  subscription: Subscription;
  /** Based on the screen size, switch from standard to one column per row */

  loading;

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
    this.exitsService.getExits().subscribe(async entry => {
      const { data } = entry;
      this.loading = true;
      Promise.all(
        data.map(async exit => {
          return new Promise(resolve => {
            this.exitsService.getExitDetails(exit.id).subscribe(({ data }) => {
              const { rate, entry, ...rest }: any = data;
              const {
                value: rate_value,
                name: rate_name,
                description: rate_description
              }: {
                value: string;
                name: string;
                description: string;
              } = rate;
              const {
                place,
                time_entry_format,
                vehicle
              }: {
                place: string;
                time_entry_format: string;
                vehicle: {
                  plate: string;
                  brand: string;
                  year: number;
                };
              } = entry;

              resolve({
                dataAll: data,
                ...(rest as Exit),
                date_departure: exit.date_departure,
                hour_departure: this.datePipe.transform(
                  exit.hour_departure,
                  "hh:mm",
                  "UTC"
                ),
                plate: vehicle.plate,
                place,
                time_entry_format,
                rate_value,
                rate_name,
                rate_description
              });
            });
          });
        })
      ).then(completed => {
        this.loading = false;
        this.dataSource = new MatTableDataSource(completed as Exit[]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    });
  }

  getInfoEntrie() {}

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  openDialogCreateExit(data) {
    const { row } = data;
    const dialogRef = this.dialog.open(DialogCreateExit, {
      data: {
        id: row.id,
        entry_id: row.entry_id,
        rate_id: row.rate_id,
        isNew: data.isNew,
        date_departure: row.date_departure,
        hour_departure: row.hour_departure
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
    const dialogRef = this.dialog.open(DialogConfirm);
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.exitsService.deleteExit(id).subscribe(
          (res): void => {
            const { success, message } = res;
            if (success) {
              this.getData();
              this.openSnackBar({
                message,
                action: "Exit"
              });
            }
          }
        );
      }
    });
  }
}
