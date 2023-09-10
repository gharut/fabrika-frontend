import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Supplier} from "../../../models/suppliers/supplier.model";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './contacts-dialog.component.html',
  styleUrls: ['./contacts-dialog.component.scss']
})
export class ContactsDialogComponent implements OnInit{
  supplier: Supplier;

  constructor(public dialogRef: MatDialogRef<ContactsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {supplier: Supplier}) {
    // Update view with given values
    this.supplier = data.supplier;
  }


  close(): void {
    // Close the dialog, return false
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }
}
