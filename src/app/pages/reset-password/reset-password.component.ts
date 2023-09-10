import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountService} from "../../services/account.service";
import {first} from 'rxjs/operators';
import {environment} from "../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-dashboard',
  templateUrl: 'reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  token: string
  resetForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AccountService,
    private toastr: ToastrService,
  ) {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, this.matchValidator('password')]],
      token: [this.token, []],
    });


  }

  ngOnInit() {

  }

  onSubmit() {

    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.reset(JSON.stringify(this.resetForm.value)).subscribe({
      next: result => {
        this.loading = false
        if (result.success) {
          this.toastr.success("Пароль успешно обнавлен.","Изменения сохранены!");
          this.router.navigate(['/login']);
        }

      },
      error: error => {
        this.loading = false
        this.toastr.error("Пароль не обнавлен.","Произошла ошибка!")
      }
    })
  }

  matchValidator(
    matchTo
      :
      string,
    reverse ?: boolean
  ):
    ValidatorFn {
    return (control: AbstractControl):
      ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
      !!control.parent.value &&
      control.value ===
      (control.parent?.controls as any)[matchTo].value
        ? null
        : {matching: true};
    };
  }
}
