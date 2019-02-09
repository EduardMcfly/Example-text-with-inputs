import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { Vehicle } from "./vehicles";
import { HttpErrorHandler, HandleError } from "../http-error-handler.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept"
  })
};

interface Response {
  success: boolean;
  data: Vehicle[];
  message: string;
}

@Injectable({ providedIn: "root" })
export class VehiclesService {
  vehiclesUrl = "http://powerful-brushlands-67246.herokuapp.com/api/vehicles"; // URL to web api
  private handleError: HandleError;
  private subject = new Subject<any>();

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError("VehiclesService");
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendMessage(message: string) {
    this.subject.next({ text: message });
  }

  clearMessage() {
    this.subject.next();
  }

  /** GET vehicles from the server */
  getVehicles(): Observable<{ success: boolean; data: Vehicle[] }> {
    return this.http
      .get<{ success: boolean; data: Vehicle[] }>(this.vehiclesUrl)
      .pipe(
        catchError(
          this.handleError("getVehicles", { success: false, data: [] })
        )
      );
  }

  /* GET vehicles whose name contains search term */
  searchVehicles(term: string): Observable<Vehicle[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ? { params: new HttpParams().set("name", term) } : {};

    return this.http
      .get<Vehicle[]>(this.vehiclesUrl, options)
      .pipe(catchError(this.handleError<Vehicle[]>("searchVehicles", [])));
  }

  //////// Save methods //////////

  /** POST: add a new vehicle to the database */
  addVehicle(vehicle: Vehicle): Observable<Response> {
    return this.http.post<Response>(this.vehiclesUrl, vehicle).pipe(
      catchError(
        this.handleError("addVehicles", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }

  /** DELETE: delete the vehicle from the server */
  deleteVehicle(id: number): Observable<Response> {
    const url = `${this.vehiclesUrl}/${id}`; // DELETE api/vehicles/42
    return this.http.delete<Response>(url, httpOptions).pipe(
      catchError(
        this.handleError("deleteVehicles", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }

  /** PUT: update the vehicle on the server. Returns the updated vehicle upon success. */
  updateVehicle(vehicle: Vehicle): Observable<Response> {
    httpOptions.headers = httpOptions.headers.set(
      "Authorization",
      "my-new-auth-token"
    );

    return this.http.put<Response>(this.vehiclesUrl, vehicle, httpOptions).pipe(
      catchError(
        this.handleError("updateVehicles", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
