import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesRoutingModule } from './services-routing.module';
import { ListComponent } from './list/list.component';
import {CreateServiceDialogComponent} from "./create-service-dialog/create-service-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDividerModule} from "@angular/material/divider";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTableModule} from "@angular/material/table";
import {UpdateServiceDialogComponent} from "./update-service-dialog/update-service-dialog.component";
import { DeliverySettingDialogComponent } from './delivery-setting-dialog/delivery-setting-dialog.component';


@NgModule({
  declarations: [
    ListComponent,
    CreateServiceDialogComponent,
    UpdateServiceDialogComponent,
    DeliverySettingDialogComponent
  ],
  imports: [
    CommonModule,
    ServicesRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTableModule
  ]
})
export class ServicesModule { }
