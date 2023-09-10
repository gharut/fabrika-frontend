import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesComponent } from './roles.component';
import {RolesRoutingModule} from "./roles-routing.module";
import { UpdateRoleDialogComponent } from './update-role-dialog/update-role-dialog.component';
import { CreateRoleDialogComponent } from './create-role-dialog/create-role-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";



@NgModule({
  declarations: [
    RolesComponent,
    UpdateRoleDialogComponent,
    CreateRoleDialogComponent,
  ],
    imports: [
        CommonModule,
        RolesRoutingModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatButtonModule,
        MatTableModule
    ]
})
export class RolesModule { }
