import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarehousesRoutingModule } from './warehouses-routing.module';
import { WarehousesComponent } from './warehouses.component';
import { CreateWarehouseDialogComponent } from './create-warehouse-dialog/create-warehouse-dialog.component';
import { UpdateWarehouseDialogComponent } from './update-warehouse-dialog/update-warehouse-dialog.component';
import {BadgeComponent} from "@coreui/angular";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";


@NgModule({
  declarations: [
    WarehousesComponent,
    CreateWarehouseDialogComponent,
    UpdateWarehouseDialogComponent
  ],
  imports: [
    CommonModule,
    WarehousesRoutingModule,
    BadgeComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    NgxMaskDirective,
    MatCardModule,
    MatDialogModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ]
})
export class WarehousesModule { }
