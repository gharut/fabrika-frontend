import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AccountService} from "../../services/account.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {Warehouse} from "../../models/warehouses/warehouse.model";
import {WarehouseService} from "../../services/warehouse.service";
import {CreateWarehouseDialogComponent} from "./create-warehouse-dialog/create-warehouse-dialog.component";
import {UpdateWarehouseDialogComponent} from "./update-warehouse-dialog/update-warehouse-dialog.component";
import {WarehouseSelections} from "../../models/warehouses/warehouse-selections.model";

@Component({
  selector: 'app-warehouses',
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.scss']
})

export class WarehousesComponent implements OnInit{
  warehouses: Warehouse[] = []
  warehouseTable: MatTableDataSource<Warehouse>;
  selections!: WarehouseSelections

  constructor(
    private warehouseService: WarehouseService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
  ){
    this.warehouseTable = new MatTableDataSource<Warehouse>();
    this.warehouseService.getSelections().subscribe((data) => {
      this.selections = data
    });
  }

  ngOnInit(): void {
    this.warehouseService.list().subscribe((warehouse: Warehouse[]) => {
      this.fetchWarehouses(warehouse);
    });
  }

  fetchWarehouses(warehouses: Warehouse[]) {
    this.warehouses = warehouses
    this.warehouseTable = new MatTableDataSource<Warehouse>(this.warehouses)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  openCreateWarehouseDialog() {
    const dialogRef = this.dialog.open(CreateWarehouseDialogComponent, {
      data: {
        selections: this.selections
      }
    });

    dialogRef.afterClosed().subscribe(newWarehouse => {
      if (newWarehouse) {
        this.warehouses.unshift(newWarehouse);
        this.warehouseTable = new MatTableDataSource<Warehouse>(this.warehouses)
      }
    });
  }

  openUpdateWarehouseDialog(warehouse: Warehouse) {
    const dialogRef = this.dialog.open(UpdateWarehouseDialogComponent, {
      data: {
        warehouse,
        selections: this.selections
      },
    });

    dialogRef.afterClosed().subscribe(warehouse => {
      if (warehouse) {
        const index = this.warehouses.findIndex(r => r.id === warehouse.id);

        if (index !== -1) {
          this.warehouses[index] = warehouse;
          this.warehouseTable = new MatTableDataSource<Warehouse>(this.warehouses)
        }

      }
    });
  }

  openDeleteWarehouseDialog(warehouse: Warehouse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалить склад "${warehouse.name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const index = this.warehouseTable.data.findIndex(r => r.id === warehouse.id);

        this.warehouseService.deleteWarehouse(warehouse.id!).subscribe({
          next: (result: any) => {
            if (result.success) {
              const rIndex = this.warehouses.findIndex(r => r.id === warehouse.id);

              if (rIndex > -1) {
                delete this.warehouses[rIndex]
              }

              this.warehouseTable.data = this.warehouseTable.data.filter((u) => u.id !== warehouse.id);
              this.toastrService.success("Склад успешно удален!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Склад не удален!", "Произошла ошибка")
            }
          },
          error: () => {
            this.toastrService.error("Склад не удален!", "Произошла ошибка")
          }
        })
      }
    });
  }
}
