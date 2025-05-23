import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WarehousesComponent} from "./warehouses.component";

const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent,
    data: {
      title: 'Склады',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehousesRoutingModule { }
