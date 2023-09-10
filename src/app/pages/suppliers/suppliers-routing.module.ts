import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RolesComponent} from "../roles/roles.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    data: {
      title: 'Поставщики',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
