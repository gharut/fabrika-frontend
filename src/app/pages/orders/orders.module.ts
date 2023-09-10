import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { CreateOrderDialogComponent } from './create-order-dialog/create-order-dialog.component';
import { OrdersComponent } from './orders.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatStepperModule} from "@angular/material/stepper";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatSelectModule} from "@angular/material/select";
import {NgxMaskDirective, provideNgxMask} from "ngx-mask";
import {MatCardModule} from "@angular/material/card";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import { CreateOrderComponent } from './create-order/create-order.component';
import {
  BadgeComponent,
  BgColorDirective, ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent, CardTextDirective, CardTitleDirective,
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormSelectDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  NavComponent,
  NavLinkDirective,
  ProgressBarComponent, ProgressComponent,
  RowComponent,
  TabContentComponent,
  TabContentRefDirective,
  TabPaneComponent,
  TextColorDirective, WidgetStatBComponent
} from "@coreui/angular";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from "@angular/material/tabs";
import {MatSortModule} from "@angular/material/sort";
import { OrderItemComponent } from './order-item/order-item.component';
import {IconComponent} from "@coreui/icons-angular";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatMenuModule} from "@angular/material/menu";
import { CalculationSheetDialogComponent } from './calculation-sheet-dialog/calculation-sheet-dialog.component';


@NgModule({
  declarations: [
    CreateOrderDialogComponent,
    OrdersComponent,
    CreateOrderComponent,
    OrderItemComponent,
    CalculationSheetDialogComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatAutocompleteModule,
    MatSelectModule,
    NgxMaskDirective,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    MatGridListModule,
    MatListModule,
    RowComponent,
    ColComponent,
    ContainerComponent,
    MatTooltipModule,
    MatChipsModule,
    MatTabsModule,
    CardFooterComponent,
    MatSortModule,
    BadgeComponent,
    FormControlDirective,
    FormSelectDirective,
    IconComponent,
    TextColorDirective,
    MatExpansionModule,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    MatSlideToggleModule,
    NavComponent,
    TabContentComponent,
    TabPaneComponent,
    NavLinkDirective,
    TabContentRefDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    BgColorDirective,
    ProgressBarComponent,
    ProgressComponent,
    WidgetStatBComponent,
    CardTitleDirective,
    CardTextDirective,
    ButtonDirective,
    MatMenuModule,
  ],
  providers: [
    provideNgxMask()
  ]
})
export class OrdersModule { }
