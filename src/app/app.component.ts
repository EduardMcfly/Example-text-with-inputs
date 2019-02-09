import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const navList: { title: string; path: string; icon?: string }[] = [
  { path: 'parking/entries', title: 'Parqueadero', icon: 'local_parking' },
  { path: 'vehicles', title: 'Vehículos', icon: 'directions_car' },
  { path: 'rates', title: 'Tarifas', icon: 'attach_money' }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog
  ) {}
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  navList = navList;
  title = 'ParkingHRS';
  log = text => {
    console.log(text);
  }
}
