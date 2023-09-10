import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ConsumableRoutingModule} from './consumable-routing.module';
import {WrapperComponent} from './wrapper/wrapper.component';
import {ConsumablesComponent} from './consumables/consumables.component';
import {TagsComponent} from './tags/tags.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {BadgeComponent, ButtonDirective} from "@coreui/angular";
import {CreateTagDialogComponent} from "./tags/create-tag-dialog/create-tag-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {EditTagDialogComponent} from "./tags/edit-tag-dialog/edit-tag-dialog.component";
import {
  CreateConsumableDialogComponent
} from "./consumables/create-consumable-dialog/create-consumable-dialog.component";
import {MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatCardModule} from "@angular/material/card";
import {
  UpdateConsumableDialogComponent
} from "./consumables/update-consumable-dialog/update-consumable-dialog.component";

@NgModule({
  declarations: [

    WrapperComponent,
    ConsumablesComponent,
    TagsComponent,
    CreateTagDialogComponent,
    EditTagDialogComponent,
    CreateConsumableDialogComponent,
    UpdateConsumableDialogComponent
  ],
  imports: [
    CommonModule,
    ConsumableRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    ButtonDirective,
    BadgeComponent,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatCardModule
  ]
})
export class ConsumableModule {
}
