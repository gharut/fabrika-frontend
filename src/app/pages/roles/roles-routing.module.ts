import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {RolesComponent} from "./roles.component";

const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
    data: {
      title: 'Роли',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
