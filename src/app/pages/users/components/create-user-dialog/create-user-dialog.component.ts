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


@Component({
  selector: 'app-create-role-dialog',
  styleUrls: ['./create-user-dialog.component.scss'],
  templateUrl: './create-user-dialog.component.html',
  providers: [CheckboxControlValueAccessor]
})
export class CreateUserDialogComponent implements OnInit {
  userForm!: FormGroup;
  roles?: Role[];

  formSubmitting: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private toastrService: ToastrService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roleService.listRoles().subscribe( roles => {
      this.roles = roles
    })
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      name: ['', {
        validators: [Validators.required],
      }],
      email: ['', {
        validators: [Validators.required, Validators.email],
      }],
      role: ['', Validators.required],
      address: [''],
      phone: [''],
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const newUser: NewUser = {
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      role: this.userForm.value.role,
      address: this.userForm.value.address,
      phone: this.userForm.value.phone,
    };

    this.formSubmitting = true
    this.userService.createUser(newUser).subscribe({

      next: result => {
        this.formSubmitting = false
        if(result.success) {
          this.toastrService.success("Пользователь успешно создан!","Изменения сохранены!")
          this.dialogRef.close(result.data);
        }else{
          this.toastrService.error("Пользователь не создан!", "Произошла ошибка")
          this.dialogRef.close();
        }
      },
      error: data => {
        this.formSubmitting = false
        this.toastrService.error("Пользователь не создан!", "Произошла ошибка")
        this.dialogRef.close();
      }
    })
  }

  onCancel() {
    this.dialogRef.close();
  }
}
