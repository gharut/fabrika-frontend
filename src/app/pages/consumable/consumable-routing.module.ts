import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfileComponent} from "../profile/profile.component";
import {WrapperComponent} from "./wrapper/wrapper.component";

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    data: {
      title: 'Расходники',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumableRoutingModule { }
