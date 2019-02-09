import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Exit } from "./exits";
import {
  HttpErrorHandler,
  HandleError
} from "../../http-error-handler.service";

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
  data: Exit[];
  message: string;
  errors: any;
}

@Injectable({ providedIn: "root" })
export class ExitsService {
  exitsUrl = "http://powerful-brushlands-67246.herokuapp.com/api/exits"; // URL to web api
  private handleError: HandleError;
  private subject = new Subject<any>();

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError("ExitsService");
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

  /** GET exits from the server */
  getExits(): Observable<{ success: boolean; data: Exit[] }> {
    return this.http
      .get<{ success: boolean; data: Exit[] }>(this.exitsUrl)
      .pipe(
        catchError(this.handleError("getExits", { success: false, data: [] }))
      );
  }

  /** GET exits from the server */
  getExitDetails(id: number): Observable<{ success: boolean; data: Exit[] }> {
    return this.http
      .get<{ success: boolean; data: Exit[] }>(
        `${this.exitsUrl}/show_details/${id}`
      )
      .pipe(
        catchError(this.handleError("getExits", { success: false, data: [] }))
      );
  }

  /* GET exits whose name contains search term */
  searchExits(term: string): Observable<Exit[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ? { params: new HttpParams().set("name", term) } : {};

    return this.http
      .get<Exit[]>(this.exitsUrl, options)
      .pipe(catchError(this.handleError<Exit[]>("searchExits", [])));
  }

  //////// Save methods //////////

  /** POST: add a new entry to the database */
  addExit(entry: Exit): Observable<Response> {
    return this.http.post<Response>(this.exitsUrl, entry).pipe(
      catchError(
        this.handleError("addExits", {
          success: false,
          data: [],
          message: "",
          errors: ""
        })
      )
    );
  }

  /** DELETE: delete the entry from the server */
  deleteExit(id: number): Observable<Response> {
    const url = `${this.exitsUrl}/${id}`; // DELETE api/exits/42
    return this.http.delete<Response>(url, httpOptions).pipe(
      catchError(
        this.handleError("deleteExits", {
          success: false,
          data: [],
          message: "",
          errors: ""
        })
      )
    );
  }

  /** PUT: update the entry on the server. Returns the updated entry upon success. */
  updateExit(entry: Exit): Observable<Response> {
    httpOptions.headers = httpOptions.headers.set(
      "Authorization",
      "my-new-auth-token"
    );

    return this.http
      .put<Response>(`${this.exitsUrl}/${entry.id}`, entry, httpOptions)
      .pipe(
        catchError(
          this.handleError("updateExits", {
            success: false,
            data: [],
            message: "",
            errors: ""
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
