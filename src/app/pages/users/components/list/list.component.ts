import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../services/user.service";
import {User} from "../../../../models/users/user.model";
import {MatTableDataSource} from "@angular/material/table";
import {RoleWithDeleting} from "../../../roles/roles.component";
import {AccountService} from "../../../../services/account.service";
import {Role} from "../../../../models/roles/role.model";
import {environment} from "../../../../../environments/environment";
import {CreateRoleDialogComponent} from "../../../roles/create-role-dialog/create-role-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {CreateUserDialogComponent} from "../create-user-dialog/create-user-dialog.component";
import {UpdateUserDialogComponent} from "../update-user-dialog/update-user-dialog.component";
import {ConfirmDialogComponent} from "../../../../components/confirm-dialog/confirm-dialog.component";
import {ToastrService} from "ngx-toastr";

export class UserWithDelete extends User{
  deletingProcess?: boolean
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{
  users: User[] = []
  usersTable: MatTableDataSource<UserWithDelete>;
  webUrl: string = environment.webUrl;

  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private toastrService: ToastrService,
  ){
    this.usersTable = new MatTableDataSource<UserWithDelete>();
  }

  ngOnInit(): void {
    this.userService.listUsers().subscribe((users: User[]) => {
      this.fetchUserList(users);
    });
  }

  fetchUserList(users: User[]) {
    this.users = users
    this.usersTable = new MatTableDataSource<UserWithDelete>(this.users)
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }


  openCreateUserDialog() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(newUser => {
      if (newUser) {
        this.users.push(newUser);
        this.usersTable = new MatTableDataSource<UserWithDelete>(this.users)
      }
    });
  }

  openUpdateUserDialog(user: User) {
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      data: user
    });

    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        const index = this.users.findIndex(r => r.id === user.id);
        if (index !== -1) {
          this.users[index] = user;
          this.usersTable = new MatTableDataSource<UserWithDelete>(this.users)
        }

      }
    });
  }

  openDeleteUserDialog(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалит пользователя "${user.name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        const index = this.usersTable.data.findIndex(r => r.id === user.id);
        this.usersTable.data[index].deletingProcess = true;

        this.userService.deleteUser(user.id!).subscribe({

          next: result => {
            if (result.success) {
              const rIndex = this.users.findIndex(r => r.id === user.id);
              if(rIndex > -1){
                delete this.users[rIndex]
              }

              this.usersTable.data = this.usersTable.data.filter((u) => u.id !== user.id);
              this.toastrService.success("Пользователь успешно удален!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Пользователь не удален!", "Произошла ошибка")
              if (index !== -1) {
                this.usersTable.data[index].deletingProcess = false;
              }
            }
          },
          error: data => {
            this.usersTable.data[index].deletingProcess = false;
            this.toastrService.error("Пользователь не удалеа!", "Произошла ошибка")
          }
        });
      }
    });
  }


}
