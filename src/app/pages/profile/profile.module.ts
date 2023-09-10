import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import {ProfileComponent} from "./profile.component";
import {
  AvatarComponent,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule, ListGroupModule, ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalHeaderComponent,
  SharedModule
} from "@coreui/angular";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ImageCropperModule} from "ngx-image-cropper";
import {AvatarModule} from "ngx-avatars";
import {MatInputModule} from "@angular/material/input";
import {NgxMaskDirective, NgxMaskPipe, provideNgxMask} from "ngx-mask";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    ListGroupModule,
    ImageCropperModule,
    AvatarComponent,
    AvatarModule,
    MatInputModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    provideNgxMask()
  ]
})
export class ProfileModule { }
