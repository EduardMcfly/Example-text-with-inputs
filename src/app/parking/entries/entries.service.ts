import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { HttpHeaders } from "@angular/common/http";

import { Observable, Subject } from "rxjs";
import { catchError } from "rxjs/operators";

import { Entry } from "./entries";
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
  data: Entry[];
  message: string;
}

@Injectable({ providedIn: "root" })
export class EntrysService {
  entriesUrl = "http://powerful-brushlands-67246.herokuapp.com/api/entries"; // URL to web api
  private handleError: HandleError;
  private subject = new Subject<any>();

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError("EntrysService");
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

  /** GET entries from the server */
  getEntrys(): Observable<{ success: boolean; data: Entry[] }> {
    return this.http
      .get<{ success: boolean; data: Entry[] }>(this.entriesUrl)
      .pipe(
        catchError(this.handleError("getEntrys", { success: false, data: [] }))
      );
  }

  /* GET entries whose name contains search term */
  searchEntrys(term: string): Observable<Entry[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ? { params: new HttpParams().set("name", term) } : {};

    return this.http
      .get<Entry[]>(this.entriesUrl, options)
      .pipe(catchError(this.handleError<Entry[]>("searchEntrys", [])));
  }

  //////// Save methods //////////

  /** POST: add a new entry to the database */
  addEntry(entry: Entry): Observable<Response> {
    return this.http.post<Response>(this.entriesUrl, entry).pipe(
      catchError(
        this.handleError("addEntrys", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }

  /** DELETE: delete the entry from the server */
  deleteEntry(id: number): Observable<Response> {
    const url = `${this.entriesUrl}/${id}`; // DELETE api/entries/42
    return this.http.delete<Response>(url, httpOptions).pipe(
      catchError(
        this.handleError("deleteEntrys", {
          success: false,
          data: [],
          message: ""
        })
      )
    );
  }

  /** PUT: update the entry on the server. Returns the updated entry upon success. */
  updateEntry(entry: Entry): Observable<Response> {
    httpOptions.headers = httpOptions.headers.set(
      "Authorization",
      "my-new-auth-token"
    );

    return this.http.put<Response>(this.entriesUrl, entry, httpOptions).pipe(
      catchError(
        this.handleError("updateEntrys", {
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
