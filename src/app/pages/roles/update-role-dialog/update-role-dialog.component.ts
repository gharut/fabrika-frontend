import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import { Role, Permission } from '../../../models/roles/role.model';
import {PERMISSION_CATEGORIES} from "../../../constants/permission_categories";
import {Observable, of} from "rxjs";
import {RoleService} from "../../../services/role.service";
import {MatTableDataSource} from "@angular/material/table";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-update-role-dialog',
  styleUrls: ['./update-role-dialog.component.scss'],
  templateUrl: './update-role-dialog.component.html'
})
export class UpdateRoleDialogComponent implements OnInit {
  roleForm!: FormGroup;
  permissions: string[] = [];
  categorizedPermissions: Record<string, Permission[]>;
  loaded: boolean = false
  formSubmitting: boolean = false
  readonly PERMISSION_CATEGORIES = PERMISSION_CATEGORIES

  constructor(
    private dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    //this.permissions = data.permissions;
    this.categorizedPermissions = data.categorizedPermissions;
  }

  ngOnInit() {
    const role = this.data.role;
    //this.roleService.getRole(this.data.role.id)
    this.roleService.getRole(this.data.role.id)
      .subscribe(
        role => {
          role.permissions?.forEach(permission => {
            this.permissions.push(permission.id!)
          })
          this.loaded = true
          this.roleForm = this.formBuilder.group({
            name: [role.name, {
              validators: [Validators.required],
              asyncValidators: [this.latinCharactersValidator()],
            }],
            visible_name: [role.visible_name, Validators.required],
            permissions: [this.permissions]
          });
        },
        error => {
          console.error('Error retrieving roles:', error);
        }
      );

  }

  getPermissionCategory(category: string): string {
    return this.categorizedPermissions[category]
      ? category
      : 'Общие разрешения';
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      return;
    }

    const updatedRole: Role = {
      id: this.data.role.id,
      name: this.roleForm.value.name,
      visible_name: this.roleForm.value.visible_name,
      permissions: this.roleForm.value.permissions
    };
    this.formSubmitting = true
    this.roleService.updateRole(updatedRole.id!, updatedRole).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Роль успешно обнавлена!","Изменения сохранены!")
          this.dialogRef.close(updatedRole);
        }else{
          this.toastrService.error("Роль не обнавлена!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Роль не обнавлена!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCheckboxChange(permissionId: string, checked: boolean) {
    const permissions = this.roleForm.controls['permissions'];
    const currentPermissions = permissions.value || [];

    if (checked) {
      currentPermissions.push(permissionId);
    } else {
      const index = currentPermissions.indexOf(permissionId);
      if (index >= 0) {
        currentPermissions.splice(index, 1);
      }
    }

    permissions.setValue(currentPermissions);
  }

  latinCharactersValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const regex = /^[a-zA-Z\-]+$/; // Regular expression for Latin characters and "-"
      const value = control.value;
      const valid = regex.test(value);

      return valid ? of(null) : of({ latinCharacters: { value } });
    };
  }
}
