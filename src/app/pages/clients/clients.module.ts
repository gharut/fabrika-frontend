import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { CreateClientDialogComponent } from './create-client-dialog/create-client-dialog.component';
import { UpdateClientDialogComponent } from './update-client-dialog/update-client-dialog.component';
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
    ClientsComponent,
    CreateClientDialogComponent,
    UpdateClientDialogComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
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
export class ClientsModule { }
