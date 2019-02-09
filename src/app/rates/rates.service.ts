import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { Rate } from "./rates";
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
  data: Rate[];
  message: string;
}

@Injectable({ providedIn: "root" })
export class RatesService {
  ratesUrl = "http://powerful-brushlands-67246.herokuapp.com/api/rates"; // URL to web api
  private handleError: HandleError;
  private subject = new Subject<any>();

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError("RatesService");
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

  /** GET rates from the server */
  getRates(): Observable<{ success: boolean; data: Rate[] }> {
    return this.http
      .get<{ success: boolean; data: Rate[] }>(this.ratesUrl)
      .pipe(
        catchError(this.handleError("getRates", { success: false, data: [] }))
      );
  }

  /* GET rates whose name contains search term */
  searchRates(term: string): Observable<Rate[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ? { params: new HttpParams().set("name", term) } : {};

    return this.http
      .get<Rate[]>(this.ratesUrl, options)
      .pipe(catchError(this.handleError<Rate[]>("searchRates", [])));
  }

  //////// Save methods //////////

  /** POST: add a new rate to the database */
  addRate(rate: Rate): Observable<Response> {
    return this.http.post<Response>(this.ratesUrl, rate).pipe(
      catchError(
        this.handleError("addRates", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }

  /** DELETE: delete the rate from the server */
  deleteRate(id: number): Observable<Response> {
    const url = `${this.ratesUrl}/${id}`; // DELETE api/rates/42
    return this.http.delete<Response>(url, httpOptions).pipe(
      catchError(
        this.handleError("deleteRates", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }

  /** PUT: update the rate on the server. Returns the updated rate upon success. */
  updateRate(rate: Rate): Observable<Response> {
    httpOptions.headers = httpOptions.headers.set(
      "Authorization",
      "my-new-auth-token"
    );

    return this.http
      .put<Response>(`${this.ratesUrl}/${rate.id}`, rate, httpOptions)
      .pipe(
        catchError(
          this.handleError("updateRates", {
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
