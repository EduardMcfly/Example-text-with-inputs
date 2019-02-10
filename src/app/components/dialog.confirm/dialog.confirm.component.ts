import { Component, Inject, OnInit, Directive } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

import * as _ from "lodash";

@Component({
  selector: "dialog-confirm",
  templateUrl: "dialog.confirm.component.html"
})
export class DialogConfirm implements OnInit {
  entryForm: FormGroup;
  submitted = false;
  loading = false;
  isNew: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogConfirm>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isNew: boolean;
      reloadData: Function;
    }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  ngOnInit() {}

  // convenience getter for easy access to form fields
  get f() {
    return this.entryForm.controls;
  }
}
