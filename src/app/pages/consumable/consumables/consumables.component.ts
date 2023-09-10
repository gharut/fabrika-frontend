import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {TagService} from "../../../services/tag.service";
import {Tag, TagWithCount} from "../../../models/tags/tag.model";
import {AccountService} from "../../../services/account.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateConsumableDialogComponent} from "./create-consumable-dialog/create-consumable-dialog.component";
import {Consumable} from "../../../models/consumables/consumable.model";
import {ConsumablesService} from "../../../services/consumables.service";
import {Role} from "../../../models/roles/role.model";
import {ConfirmDialogComponent} from "../../../components/confirm-dialog/confirm-dialog.component";
import {UpdateConsumableDialogComponent} from "./update-consumable-dialog/update-consumable-dialog.component";
import {ToastrService} from "ngx-toastr";
import {OperationComponent} from "../../inout/operation/operation.component";

export class ConsumableWithDeleting extends Consumable {
  deletingProcess?: boolean = false
}
@Component({
  selector: 'app-consumables',
  templateUrl: './consumables.component.html',
  styleUrls: ['./consumables.component.scss']
})
export class ConsumablesComponent implements OnInit{
  consumables?: Consumable[];
  tableData!: MatTableDataSource<ConsumableWithDeleting>;
  private tags: Tag[] = [];
  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private consumableService: ConsumablesService,
    private tagService: TagService,
    private toastrService: ToastrService
  ) {
    this.tableData = new MatTableDataSource<ConsumableWithDeleting>();
    this.consumableService.list().subscribe(data => this.fetchTableData(data))
  }
  ngOnInit(): void {
    this.tagService.list().subscribe( tags => {
      this.tags = tags;
    })
  }

  openCreateConsumableDialog() {
    const dialogRef = this.dialog.open(CreateConsumableDialogComponent, {data: this.tags});

    dialogRef.afterClosed().subscribe(consumable => {
      if (consumable) {
        this.consumables!.push(consumable);
        this.tableData = new MatTableDataSource<ConsumableWithDeleting>(this.consumables)
      }
    });
  }


  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  fetchTableData(consumables: Consumable[]) {
    this.consumables = consumables;
    this.tableData = new MatTableDataSource<ConsumableWithDeleting>(this.consumables)
  }


  openUpdateConsumableDialog(consumable: Consumable) {
    const dialogRef = this.dialog.open(UpdateConsumableDialogComponent, {
      data: {
        tags: this.tags,
        consumable: consumable,
      }
    });

    dialogRef.afterClosed().subscribe(consumable => {
      if (consumable) {
        const index = this.consumables!.findIndex(r => r.id === consumable.id);

        if (index !== -1) {
          this.consumables![index] = consumable;
          this.tableData = new MatTableDataSource<Role>(this.consumables)
        }

      }
    });
  }

  openDeleteRoleDialog(consumable: Consumable) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалит расходник "${consumable.name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        const index = this.tableData.data.findIndex(r => r.id === consumable.id);
        this.tableData.data[index].deletingProcess = true;

        this.consumableService.deleteConsumable(consumable.id!).subscribe({

          next: result => {
            if (result.success) {
              const rIndex = this.consumables!.findIndex(r => r.id === consumable.id);
              if(rIndex > -1){
                delete this.consumables![rIndex]
              }

              this.tableData.data = this.tableData.data.filter((u) => u.id !== consumable.id);
              this.toastrService.success("Роль успешно удалена!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Роль не удалена!", "Произошла ошибка")
              if (index !== -1) {
                this.tableData.data[index].deletingProcess = false;
              }
            }
          },
          error: data => {
            this.tableData.data[index].deletingProcess = false;
            this.toastrService.error("Роль не удалена!", "Произошла ошибка")
          }
        });
      }
    });
  }

  openOperation(type: any, consumable: Consumable) {
    const dialogRef = this.dialog.open(OperationComponent, {data: {
        type: type,
        consumable_id: consumable.id
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data && data.consumable) {
        const index = this.consumables!.findIndex(r => r.id === data.consumable.id);
        console.log(index)
        console.log(this.consumables![index].qty)
        console.log(data.consumable.qty)
        if(index>-1) {
          this.consumables![index].qty = data.consumable.qty
          this.tableData = new MatTableDataSource<ConsumableWithDeleting>(this.consumables)
        }
      }
    });
  }



}
