import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent} from "../components/invoice/invoice.component";
import { InvoiceDialogComponent} from "../components/invoice-dialog/invoice-dialog.component";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  exports: [
    InvoiceComponent,
    InvoiceDialogComponent,
    CommonModule
  ],
})
export class SharedModule {}
