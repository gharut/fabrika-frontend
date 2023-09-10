import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {WrapperComponent} from "./wrapper/wrapper.component";

const routes: Routes = [
  {
    path: '',
    component: WrapperComponent,
    data: {
      title: 'Приход/Расход',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InoutRoutingModule { }
