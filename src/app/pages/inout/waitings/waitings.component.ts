import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AccountService} from "../../../services/account.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {SupplierService} from "../../../services/supplier.service";
import {PAYMENT_TYPES} from "../../../constants/payment_types";
import {InoutService} from "../../../services/inout.service";
import {ConsumableHistoryItemModel} from "../../../models/consumables/consumableHistoryItem.model";
import {UNITS_SHORT} from "../../../constants/units";
import {CONSUMABLE_OPERATION_TYPES} from "../../../constants/consumable_operation_types";
import {CONSUMABLE_DELIVERED_TYPES} from "../../../constants/consumable_delivered_types";
import {CONSUMABLE_PAYMENT_TYPES} from "../../../constants/consumable_payment_types";

export class ConsumableHistoryItemWithProcesses extends Supplier{
  deliveryProcess?: boolean = false
  paymentProcess?: boolean = false
}
@Component({
  selector: 'app-inout-waiting',
  templateUrl: './waitings.component.html',
  styleUrls: ['./waitings.component.scss']
})
export class WaitingsComponent implements OnInit{
  items: ConsumableHistoryItemModel[] = []
  itemsTable: MatTableDataSource<ConsumableHistoryItemWithProcesses>;
  waitingList: any[] = []
  readonly PAYMENT_TYPES = PAYMENT_TYPES
  readonly CONSUMABLE_OPERATION_TYPES = CONSUMABLE_OPERATION_TYPES
  readonly UNIT_SHORT = UNITS_SHORT
  readonly CONSUMABLE_DELIVERED_TYPES = CONSUMABLE_DELIVERED_TYPES
  readonly CONSUMABLE_PAYMENT_TYPES = CONSUMABLE_PAYMENT_TYPES

  displayedColumns: string[] = [
    'type',
    'type-text',
    'type-consumable-name',
    'type-supplier',
    'qty',
    'price_per_unit',
    'total_price',
    'created_at',
    'delivery_date',
    'delivery',
    'paid',
  ];

  constructor(
    private supplierService: SupplierService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private inoutService: InoutService
  ){
    this.itemsTable = new MatTableDataSource<ConsumableHistoryItemWithProcesses>();
  }

  ngOnInit(): void {
    this.inoutService.listWaiting().subscribe((items: ConsumableHistoryItemModel[]) => {
      this.fetchWaitingList(items);
    });
  }

  fetchWaitingList(items: ConsumableHistoryItemModel[]) {
    this.items = items
    this.itemsTable = new MatTableDataSource<ConsumableHistoryItemWithProcesses>(this.items)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  sum(qty: string, price_per_unit: string): any {
    return (parseInt(qty)*parseFloat(price_per_unit)).toFixed(2)
  }

  setPaid(item: ConsumableHistoryItemModel) {
    const index = this.items.findIndex(r => r.id === item.id);
    const index_in_table = this.itemsTable.data.findIndex(r => r.id === item.id);
    this.itemsTable.data[index_in_table].paymentProcess = true
    this.inoutService.setPaid(item.id!).subscribe( result => {
      this.itemsTable.data[index_in_table].paymentProcess = false
      if(result.success) {
        this.items[index].payment_status = CONSUMABLE_PAYMENT_TYPES['PAID'];
        this.itemsTable = new MatTableDataSource<ConsumableHistoryItemWithProcesses>(this.items)
        this.ifNotWaitingRemove(index)
      }
    })
  }

  setDelivered(item: ConsumableHistoryItemModel) {
    const index = this.items.findIndex(r => r.id === item.id);
    const index_in_table = this.itemsTable.data.findIndex(r => r.id === item.id);
    this.itemsTable.data[index_in_table].deliveryProcess = true
    this.inoutService.setDelivered(item.id!).subscribe( result => {
      this.itemsTable.data[index_in_table].deliveryProcess = false
      if(result.success) {
        this.items[index].delivery_status = CONSUMABLE_DELIVERED_TYPES['DELIVERED'];
        this.itemsTable = new MatTableDataSource<ConsumableHistoryItemWithProcesses>(this.items)
        this.ifNotWaitingRemove(index)
      }
    })

  }

  ifNotWaitingRemove(index:any) {
    if(this.items[index].payment_status == CONSUMABLE_PAYMENT_TYPES['PAID']
      && this.items[index].delivery_status == CONSUMABLE_DELIVERED_TYPES['DELIVERED'])
    {
      delete this.items[index]
      this.itemsTable = new MatTableDataSource<ConsumableHistoryItemWithProcesses>(this.items)
    }
  }


}



