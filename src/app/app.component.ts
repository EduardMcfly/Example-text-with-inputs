import { Component } from "@angular/core";
import * as _ from "lodash";

const navList: { title: string; path: string; icon?: string }[] = [
  { path: "main", title: "Main", icon: "local_parking" }
];

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  navList = navList;
  title = "Example";
  log = text => {
    console.log(text);
  };
}
