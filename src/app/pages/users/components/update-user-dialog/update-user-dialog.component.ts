import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { CheckboxControlValueAccessor } from '@angular/forms';
import {Observable, of} from "rxjs";
import {UserService} from "../../../../services/user.service";
import {RoleService} from "../../../../services/role.service";
import {ToastrService} from "ngx-toastr";
import {Role} from "../../../../models/roles/role.model";
import {NewUser} from "../../../../models/users/newUser.model";
import {User} from "../../../../models/users/user.model";


@Component({
  selector: 'app-update-role-dialog',
  styleUrls: ['./update-user-dialog.component.scss'],
  templateUrl: './update-user-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})
export class UpdateUserDialogComponent implements OnInit {
  userForm!: FormGroup;
  roles?: Role[];
  user!: User;

  formSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<UpdateUserDialogComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private toastrService: ToastrService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.user = data;
    this.roleService.listRoles().subscribe( roles => {
      this.roles = roles
    })
    console.log(this.user)
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: [this.user.name, {
        validators: [Validators.required],
      }],
      email: [this.user.email, {
        validators: [Validators.required, Validators.email],
      }],
      role: [this.user.role!.id, Validators.required],
      address: [this.user.address],
      phone: [this.user.phone],
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const user: User = {
      id: this.user.id,
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      role: this.userForm.value.role,
      address: this.userForm.value.address,
      phone: this.userForm.value.phone,
    };

    this.formSubmitting = true
    this.userService.updateUser(user).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Пользователь успешно обнавлен!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Пользователь не обнавлен!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Пользователь не обнавлен!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
