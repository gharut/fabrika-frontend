import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Supplier} from "../../models/suppliers/supplier.model";
import {MatTableDataSource} from "@angular/material/table";
import {AccountService} from "../../services/account.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {ContactsDialogComponent} from "../suppliers/contacts-dialog/contacts-dialog.component";
import {PaymentsDialogComponent} from "../suppliers/payments-dialog/payments-dialog.component";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {CLIENT_TYPES} from "../../constants/client_types";
import {Client} from "../../models/suppliers/client.model";
import {ClientService} from "../../services/client.service";
import {CreateClientDialogComponent} from "./create-client-dialog/create-client-dialog.component";
import {UpdateClientDialogComponent} from "./update-client-dialog/update-client-dialog.component";

export class ClientWithDelete extends Client{
  deletingProcess?: boolean
}
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})

export class ClientsComponent implements OnInit{
  clients: Client[] = []
  clientTable: MatTableDataSource<ClientWithDelete>;
  readonly CLIENT_TYPES = CLIENT_TYPES

  constructor(
    private clientService: ClientService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
    private viewContainerRef: ViewContainerRef
  ){
    this.clientTable = new MatTableDataSource<ClientWithDelete>();
  }

  ngOnInit(): void {
    this.clientService.list().subscribe((client: Client[]) => {
      this.fetchClients(client);
    });
  }

  fetchClients(clients: Client[]) {
    this.clients = clients
    this.clientTable = new MatTableDataSource<ClientWithDelete>(this.clients)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }


  openCreateClientDialog() {
    const dialogRef = this.dialog.open(CreateClientDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(newClient => {
      if (newClient) {
        this.clients.push(newClient);
        this.clientTable = new MatTableDataSource<ClientWithDelete>(this.clients)
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


  openUpdateClientDialog(client: Client) {
    const dialogRef = this.dialog.open(UpdateClientDialogComponent, {
      data: client
    });

    dialogRef.afterClosed().subscribe(client => {
      if (client) {
        const index = this.clients.findIndex(r => r.id === client.id);
        if (index !== -1) {
          this.clients[index] = client;
          this.clientTable = new MatTableDataSource<ClientWithDelete>(this.clients)
        }

      }
    });
  }

  openDeleteClientDialog(client: Client) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалить поставщика "${client.name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        const index = this.clientTable.data.findIndex(r => r.id === client.id);
        this.clientTable.data[index].deletingProcess = true;

        this.clientService.deleteClient(client.id!).subscribe({

          next: result => {
            if (result.success) {
              const rIndex = this.clients.findIndex(r => r.id === client.id);
              if(rIndex > -1){
                delete this.clients[rIndex]
              }

              this.clientTable.data = this.clientTable.data.filter((u) => u.id !== client.id);
              this.toastrService.success("Клиент успешно удален!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Клиент не удален!", "Произошла ошибка")
              if (index !== -1) {
                this.clientTable.data[index].deletingProcess = false;
              }
            }
          },
          error: data => {
            this.clientTable.data[index].deletingProcess = false;
            this.toastrService.error("Клиент не удален!", "Произошла ошибка")
          }
        });
      }
    });
  }


}
