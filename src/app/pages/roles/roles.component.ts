import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Role, Permission} from '../../models/roles/role.model';
import {RoleService} from '../../services/role.service';
import {UpdateRoleDialogComponent} from './update-role-dialog/update-role-dialog.component';
import {CreateRoleDialogComponent} from './create-role-dialog/create-role-dialog.component';
import {AccountService} from '../../services/account.service';
import {PERMISSION_CATEGORIES} from "../../constants/permission_categories";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";

export class RoleWithDeleting extends Role {
  deletingProcess?: boolean = false
}

@Component({
  selector: 'app-roles',
  styleUrls: ['./roles.component.scss'],
  templateUrl: './roles.component.html',
})

export class RolesComponent implements OnInit {
  roles: Role[] = [];
  permissions: Permission[] = [];
  categorizedPermissions: Record<string, Permission[]> = {};
  dataSource: MatTableDataSource<RoleWithDeleting>


  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private accountService: AccountService,
    private toastrService: ToastrService
  ) {
    this.dataSource = new MatTableDataSource<RoleWithDeleting>();
  }

  ngOnInit() {
    this.getRoles();
    this.getPermissions();
  }

  getRoles() {
    this.roleService.listRoles()
      .subscribe(
        roles => {
          this.dataSource.data = roles;
          this.roles = roles
        },
        error => {
          console.error('Error retrieving roles:', error);
        }
      );
  }

  getPermissions() {
    this.roleService.listPermissions()
      .subscribe(
        permissions => {
          this.permissions = permissions;
          this.categorizePermissions();
        },
        error => {
          console.error('Error retrieving roles:', error);
        }
      );
  }

  canPerformAction(permission: string): boolean {
    return this.accountService.can(permission);
  }

  private categorizePermissions() {
    for (const permission of this.permissions) {
      const category = permission.category;
      if (category && PERMISSION_CATEGORIES.hasOwnProperty(category)) {
        if (!this.categorizedPermissions[category]) {
          this.categorizedPermissions[category] = [];
        }
        this.categorizedPermissions[category].push(permission);
      }
    }

    console.log(this.categorizedPermissions)
  }

  openUpdateRoleDialog(role: Role) {
    const dialogRef = this.dialog.open(UpdateRoleDialogComponent, {
      data: {
        role,
        permissions: this.permissions,
        categorizedPermissions: this.categorizedPermissions
      }
    });

    dialogRef.afterClosed().subscribe(updatedRole => {
      if (updatedRole) {
        const index = this.roles.findIndex(r => r.id === updatedRole.id);
        console.log(index)
        if (index !== -1) {
          this.roles[index] = updatedRole;
          this.dataSource = new MatTableDataSource<Role>(this.roles)
        }

      }
    });
  }

  openDeleteRoleDialog(role: Role) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Удаление",
        message: `Вы уверены что хотите удалит роль "${role.visible_name}"?`,
        confirm: "Удалить",
        discard: "Отменить"
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        const index = this.dataSource.data.findIndex(r => r.id === role.id);
        this.dataSource.data[index].deletingProcess = true;

        this.roleService.deleteRole(role.id!).subscribe({

          next: result => {
            if (result.success) {
              const rIndex = this.roles.findIndex(r => r.id === role.id);
              if(rIndex > -1){
                delete this.roles[rIndex]
              }

              this.dataSource.data = this.dataSource.data.filter((u) => u.id !== role.id);
              this.toastrService.success("Роль успешно удалена!", "Изменения сохранены!")

            } else {
              this.toastrService.error("Роль не удалена!", "Произошла ошибка")
              if (index !== -1) {
                this.dataSource.data[index].deletingProcess = false;
              }
            }
          },
          error: data => {
            this.dataSource.data[index].deletingProcess = false;
            this.toastrService.error("Роль не удалена!", "Произошла ошибка")
          }
        });
      }
    });
  }

  openCreateRoleDialog() {
    const dialogRef = this.dialog.open(CreateRoleDialogComponent, {
      data: {
        permissions: this.permissions,
        categorizedPermissions: this.categorizedPermissions
      }
    });

    dialogRef.afterClosed().subscribe(newRole => {
      if (newRole) {
        this.roles.push(newRole);
        this.dataSource = new MatTableDataSource<Role>(this.roles)
      }
    });
  }
}
