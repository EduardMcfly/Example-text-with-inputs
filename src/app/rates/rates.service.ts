import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Rate } from "./rates";
import { HttpErrorHandler, HandleError } from "../http-error-handler.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token"
  })
};

@Injectable()
export class RatesService {
  ratesUrl = "http://powerful-brushlands-67246.herokuapp.com/api/rates/"; // URL to web api
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError("RatesService");
  }

  /** GET rates from the server */
  getRates(): Observable<Rate[]> {
    return this.http
      .get<Rate[]>(this.ratesUrl)
      .pipe(catchError(this.handleError("getRates", [])));
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
  addRate(rate: Rate): Observable<Rate> {
    return this.http
      .post<Rate>(this.ratesUrl, rate)
      .pipe(catchError(this.handleError("addRates", rate)));
  }

  /** DELETE: delete the rate from the server */
  deleteRate(id: number): Observable<{}> {
    const url = `${this.ratesUrl}/${id}`; // DELETE api/rates/42
    return this.http
      .delete(url, httpOptions)
      .pipe(catchError(this.handleError("deleteRates")));
  }

  /** PUT: update the rate on the server. Returns the updated rate upon success. */
  updateRate(rate: Rate): Observable<Rate> {
    httpOptions.headers = httpOptions.headers.set(
      "Authorization",
      "my-new-auth-token"
    );

    return this.http
      .put<Rate>(this.ratesUrl, rate, httpOptions)
      .pipe(catchError(this.handleError("updateRates", rate)));
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
