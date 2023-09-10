import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {PAYMENT_TYPES} from "../../../constants/payment_types";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './payments-dialog.component.html',
  styleUrls: ['./payments-dialog.component.scss']
})
export class PaymentsDialogComponent implements OnInit{
  supplier: Supplier;
  readonly PAYMENT_TYPES = PAYMENT_TYPES

  constructor(public dialogRef: MatDialogRef<PaymentsDialogComponent>,
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
