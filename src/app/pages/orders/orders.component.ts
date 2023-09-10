import {Component, OnInit} from '@angular/core';
import {RoleService} from "../../services/role.service";
import {MatDialog} from "@angular/material/dialog";
import {AccountService} from "../../services/account.service";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {RoleWithDeleting} from "../roles/roles.component";
import {CreateRoleDialogComponent} from "../roles/create-role-dialog/create-role-dialog.component";
import {Role} from "../../models/roles/role.model";
import {CreateOrderDialogComponent} from "./create-order-dialog/create-order-dialog.component";
import {Router} from "@angular/router";
import {OrdersService} from "../../services/orders.service";
import {ConsumableWithDeleting} from "../consumable/consumables/consumables.component";
import {OrderListItem} from "../../models/order/order.list.item";
import {UNITS_SHORT} from "../../constants/units";
import {CONSUMABLE_OPERATION_TYPES} from "../../constants/consumable_operation_types";
import {PAYMENT_TYPES} from "../../constants/payment_types";
import {ORDER_STATUS} from "../../constants/order_status";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit{
  tableData!: MatTableDataSource<OrderListItem>;
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private router: Router,
    private orderService: OrdersService,
  ) {
  }
  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  ngOnInit(): void {
    this.orderService.listOrders().subscribe( orders => {
      this.tableData = new MatTableDataSource(orders)
    })
  }

  openCreateOrderDialog() {
    this.router.navigateByUrl('/orders/create');
  }


  protected readonly UNITS_SHORT = UNITS_SHORT;
  protected readonly CONSUMABLE_OPERATION_TYPES = CONSUMABLE_OPERATION_TYPES;
  protected readonly PAYMENT_TYPES = PAYMENT_TYPES;
  protected readonly ORDER_STATUS = ORDER_STATUS;
}
