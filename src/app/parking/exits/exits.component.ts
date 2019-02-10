import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";

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
  styleUrls: ["./exits.component.css"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
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
  expandedElement;
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
                hour_departure: this.hourFormat(exit.hour_departure),
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

  hourFormat(hour) {
    this.datePipe.transform(hour, "hh:mm", "UTC");
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

  convertMinutes(num) {
    const d = Math.floor(num / 1440); // 60*24
    const h = Math.floor((num - d * 1440) / 60);
    const m = Math.round(num % 60);

    if (d > 0) {
      return d + " Dias, " + h + " Horas, " + m + " Minutos";
    } else {
      return h + " Horas, " + m + " Minutos";
    }
  }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  andres(element, expandedElement) {
    console.log(element, expandedElement);
    this.expandedElement = expandedElement === element ? null : element;
    /* return element; */
  }
}
