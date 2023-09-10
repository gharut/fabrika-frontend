import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { ListComponent } from './list/list.component';
import { SupplierComponent } from './supplier/supplier.component';
import {CreateSupplierDialogComponent} from "./create-supplier-dialog/create-supplier-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatTableModule} from "@angular/material/table";
import {
  BadgeComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent
} from "@coreui/angular";
import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatSelectModule} from "@angular/material/select";
import {MatTreeModule} from "@angular/material/tree";
import {ContactsDialogComponent} from "./contacts-dialog/contacts-dialog.component";
import {PaymentsDialogComponent} from "./payments-dialog/payments-dialog.component";
import {UpdateSupplierDialogComponent} from "./update-supplier-dialog/update-supplier-dialog.component";


@NgModule({
  declarations: [
    ListComponent,
    SupplierComponent,
    CreateSupplierDialogComponent,
    UpdateSupplierDialogComponent,
    ContactsDialogComponent,
    PaymentsDialogComponent,
  ],
  imports: [
    CommonModule,
    SuppliersRoutingModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    BadgeComponent,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    MatSelectModule,
    MatTreeModule,
    CardComponent,
    CardHeaderComponent,
    CardFooterComponent,
    CardBodyComponent,
  ]
})
export class SuppliersModule { }

