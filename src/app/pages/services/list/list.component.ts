import {Component, OnInit} from '@angular/core';
import {AccountService} from "../../../services/account.service";
import {OperationComponent} from "../../inout/operation/operation.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateServiceDialogComponent} from "../create-service-dialog/create-service-dialog.component";
import {TagService} from "../../../services/tag.service";
import {Tag} from "../../../models/tags/tag.model";
import {ServicesService} from "../../../services/services.service";
import {Service} from "../../../models/services/service.model";
import {MatTableDataSource} from "@angular/material/table";
import {SupplierWithDelete} from "../../suppliers/list/list.component";
import {Supplier} from "../../../models/suppliers/supplier.model";
import {UpdateSupplierDialogComponent} from "../../suppliers/update-supplier-dialog/update-supplier-dialog.component";
import {ConfirmDialogComponent} from "../../../components/confirm-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";
import {UpdateServiceDialogComponent} from "../update-service-dialog/update-service-dialog.component";
import {DeliverySettingDialogComponent} from "../delivery-setting-dialog/delivery-setting-dialog.component";
import {SERVICE_STEPS} from "../../../constants/service_steps";

export class ServiceWithDelete extends Service {
  deletingProcess?: boolean = false
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{

  public serviceSteps: Array<{key: string, value: string}> = []
  public allSelected: boolean = false

  private tags: Tag[] = [];
  private services: Service[] = [];
  servicesTable: MatTableDataSource<ServiceWithDelete>;

  selectedSteps: string[] = [];

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private tagService: TagService,
    private servicesService: ServicesService,
    private toastrService: ToastrService,
  ) {
    this.servicesTable = new MatTableDataSource<ServiceWithDelete>();
  }

  ngOnInit(): void {
    Object.keys(SERVICE_STEPS).forEach(key => {
      this.serviceSteps.push({ key, value: SERVICE_STEPS[key] });
    })

    this.servicesService.list().subscribe( services => {
      this.fetchServiceList(services);
    })

    this.tagService.list().subscribe( tags => {
      this.tags = tags
    })
  }

  fetchServiceList(services: Service[]) {
    this.services = services
    this.servicesTable = new MatTableDataSource<ServiceWithDelete>(this.services)
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected

    if (this.allSelected) {
      this.selectedSteps = ['all', ...this.serviceSteps.map(item => item.key)]
    } else {
      this.selectedSteps = []
    }

    this.applyFilter()
  }

  applyFilter() {
    console.log('this.selectedSteps:', this.selectedSteps)
    if (!this.selectedSteps.length) {
      this.servicesTable.data = this.services
      return
    }

    this.servicesTable.data = this.services.filter(service =>
      this.selectedSteps.every(step => service.step === step)
    );
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  openOperation() {
    const dialogRef = this.dialog.open(CreateServiceDialogComponent, {
      width: '90%',
      data: this.tags,
    });

    dialogRef.afterClosed().subscribe(data => {
      // if (consumable) {
      //   this.consumables!.push(consumable);
      //   this.tableData = new MatTableDataSource<ConsumableWithDeleting>(this.consumables)
      // }
    });
  }

  openUpdateServiceDialog(service: Service) {
    const dialogRef = this.dialog.open(UpdateServiceDialogComponent, {
      width: '90%',
      data: {tags: this.tags, service: service},
    });

    dialogRef.afterClosed().subscribe(service => {
      if (service) {
        const index = this.services.findIndex(r => r.id === service.id);
        if (index !== -1) {
          this.services[index] = service;
          this.servicesTable = new MatTableDataSource<ServiceWithDelete>(this.services)
        }

      }
    });
  }

  openDeliverySettings() {
    const dialogRef = this.dialog.open(DeliverySettingDialogComponent);
  }

  openDeleteServiceDialog(service: Service) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалить услугу "${service.name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        const index = this.servicesTable.data.findIndex(r => r.id === service.id);
        this.servicesTable.data[index].deletingProcess = true;

        this.servicesService.deleteService(service.id!).subscribe({

          next: result => {
            if (result.success) {
              const rIndex = this.services.findIndex(r => r.id === service.id);
              if(rIndex > -1){
                delete this.services[rIndex]
              }

              this.servicesTable.data = this.servicesTable.data.filter((u) => u.id !== service.id);
              this.toastrService.success("Услуга успешно удалена!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Услуга не удалена!", "Произошла ошибка")
              if (index !== -1) {
                this.servicesTable.data[index].deletingProcess = false;
              }
            }
          },
          error: data => {
            this.servicesTable.data[index].deletingProcess = false;
            this.toastrService.error("Услуга не удалена!", "Произошла ошибка")
          }
        });
      }
    });
  }


}
