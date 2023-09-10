import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrdersComponent} from "./orders.component";
import {CreateOrderComponent} from "./create-order/create-order.component";
import {OrderItemComponent} from "./order-item/order-item.component";

const routes: Routes = [
  {
    path: '',
    component: OrdersComponent,
    data: {
      title: 'Заказы',
    },
  },
  {
    path: 'view/:id',
    component: OrderItemComponent,
    data: {
      title: 'Заказ',
    },
  },
  {
    path: 'create',
    component: CreateOrderComponent,
    data: {
      title: 'Создать заказ',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
