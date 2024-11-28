import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.component.html',
})
export class InvoiceDialogComponent {
  public orderUuid: string;

  constructor(
    private clipboard: Clipboard,
    @Inject(MAT_DIALOG_DATA) public data: {uuid: string}
  ) {
    this.orderUuid = data.uuid;
  }

  public copyInvoiceLink(): void {
    this.clipboard.copy(`${document.location.origin}/invoice/${this.orderUuid}`);
  }
}
