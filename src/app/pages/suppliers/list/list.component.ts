import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {AccountService} from "../../../services/account.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {CreateSupplierDialogComponent} from "../create-supplier-dialog/create-supplier-dialog.component";
import {UpdateSupplierDialogComponent} from "../update-supplier-dialog/update-supplier-dialog.component";
import {ToastrService} from "ngx-toastr";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {SupplierService} from "../../../services/supplier.service";
import {PAYMENT_TYPES} from "../../../constants/payment_types";
import {ContactsDialogComponent} from "../contacts-dialog/contacts-dialog.component";
import {PaymentsDialogComponent} from "../payments-dialog/payments-dialog.component";
import {ConfirmDialogComponent} from "../../../components/confirm-dialog/confirm-dialog.component";

export class SupplierWithDelete extends Supplier{
  deletingProcess?: boolean
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{
  suppliers: Supplier[] = []
  supplierTable: MatTableDataSource<SupplierWithDelete>;
  readonly PAYMENT_TYPES = PAYMENT_TYPES

  constructor(
    private supplierService: SupplierService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private viewContainerRef: ViewContainerRef
  ){
    this.supplierTable = new MatTableDataSource<SupplierWithDelete>();
  }

  ngOnInit(): void {
    this.supplierService.list().subscribe((supplier: Supplier[]) => {
      this.fetchSupplierList(supplier);
    });
  }

  fetchSupplierList(suppliers: Supplier[]) {
    this.suppliers = suppliers
    this.supplierTable = new MatTableDataSource<SupplierWithDelete>(this.suppliers)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }


  openCreateSupplierDialog() {
    const dialogRef = this.dialog.open(CreateSupplierDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(newSupplier => {
      if (newSupplier) {
        this.suppliers.push(newSupplier);
        this.supplierTable = new MatTableDataSource<SupplierWithDelete>(this.suppliers)
      }
    });
  }


  openContactsDialog(supplier: Supplier): void {
    const dialogRef = this.dialog.open(ContactsDialogComponent, {
      data: { supplier: supplier }
    });
    dialogRef.afterClosed().subscribe(newSupplier => {

    });
  }

  openPaymentsDialog(supplier: Supplier): void {
    console.log(supplier)
    const dialogRef = this.dialog.open(PaymentsDialogComponent, {
      data: { supplier: supplier }
    });
    dialogRef.afterClosed().subscribe(newSupplier => {

    });
  }


  openUpdateSupplierDialog(supplier: Supplier) {
    const dialogRef = this.dialog.open(UpdateSupplierDialogComponent, {
      data: supplier
    });

    dialogRef.afterClosed().subscribe(supplier => {
      if (supplier) {
        const index = this.suppliers.findIndex(r => r.id === supplier.id);
        if (index !== -1) {
          this.suppliers[index] = supplier;
          this.supplierTable = new MatTableDataSource<SupplierWithDelete>(this.suppliers)
        }

      }
    });
  }

  openDeleteSupplierDialog(supplier: Supplier) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалить поставщика "${supplier.name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        const index = this.supplierTable.data.findIndex(r => r.id === supplier.id);
        this.supplierTable.data[index].deletingProcess = true;

        this.supplierService.deleteSupplier(supplier.id!).subscribe({

          next: result => {
            if (result.success) {
              const rIndex = this.suppliers.findIndex(r => r.id === supplier.id);
              if(rIndex > -1){
                delete this.suppliers[rIndex]
              }

              this.supplierTable.data = this.supplierTable.data.filter((u) => u.id !== supplier.id);
              this.toastrService.success("Поставщик успешно удален!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Поставщик не удален!", "Произошла ошибка")
              if (index !== -1) {
                this.supplierTable.data[index].deletingProcess = false;
              }
            }
          },
          error: data => {
            this.supplierTable.data[index].deletingProcess = false;
            this.toastrService.error("Поставщик не удален!", "Произошла ошибка")
          }
        });
      }
    });
  }


}

