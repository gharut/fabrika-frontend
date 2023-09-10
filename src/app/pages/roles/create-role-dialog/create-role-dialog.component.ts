import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Role, Permission } from '../../../models/roles/role.model';
import {PERMISSION_CATEGORIES} from "../../../constants/permission_categories";
import { CheckboxControlValueAccessor } from '@angular/forms';
import {Observable, of} from "rxjs";
import {RoleService} from "../../../services/role.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-create-role-dialog',
  styleUrls: ['./create-role-dialog.component.scss'],
  templateUrl: './create-role-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})
export class CreateRoleDialogComponent implements OnInit {
  roleForm!: FormGroup;
  permissions: Permission[];
  categorizedPermissions: Record<string, Permission[]>;
  formSubmitting: boolean = false;
  readonly PERMISSION_CATEGORIES = PERMISSION_CATEGORIES

  constructor(
    private dialogRef: MatDialogRef<CreateRoleDialogComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private toastrService: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.permissions = data.permissions;
    this.categorizedPermissions = data.categorizedPermissions;
  }

  ngOnInit() {
    this.roleForm = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators: [this.latinCharactersValidator()],
      }],
      visible_name: ['', Validators.required],
      permissions: [[]],
    });
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

    const newRole: Role = {
      name: this.roleForm.value.name,
      visible_name: this.roleForm.value.visible_name,
      permissions: this.roleForm.value.permissions,
    };

    this.formSubmitting = true
    this.roleService.createRole(newRole).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Роль успешно создана!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Роль не создана!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Роль не создана!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCheckboxChange(permissionId: string, checked: boolean) {
    const permissions = this.roleForm.controls['permissions'] as FormControl;
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
