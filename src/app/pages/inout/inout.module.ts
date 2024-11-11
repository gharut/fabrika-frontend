import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InoutRoutingModule } from './inout-routing.module';
import { ListComponent } from './list/list.component';
import { OperationComponent } from './operation/operation.component';
import {MatTableModule} from "@angular/material/table";
import {BasicPaginationComponent} from "../../components/basic-pagination/basic-pagination.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {WrapperComponent} from "./wrapper/wrapper.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {WaitingsComponent} from "./waitings/waitings.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";



@NgModule({
  declarations: [
    ListComponent,
    OperationComponent,
    BasicPaginationComponent,
    WrapperComponent,
    WaitingsComponent
  ],
  imports: [
    CommonModule,
    InoutRoutingModule,
    MatTableModule,
    MatToolbarModule,
    MatSortModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class InoutModule { }
