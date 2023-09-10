import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './components/list/list.component';
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {AvatarModule} from "ngx-avatars";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms";
import {CreateUserDialogComponent} from "./components/create-user-dialog/create-user-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {UpdateUserDialogComponent} from "./components/update-user-dialog/update-user-dialog.component";


@NgModule({
  declarations: [
    ListComponent,
    CreateUserDialogComponent,
    UpdateUserDialogComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatButtonModule,
    AvatarModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  providers: [
    provideNgxMask()
  ]
})
export class UsersModule { }
