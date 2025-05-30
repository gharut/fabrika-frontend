import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService} from "../../services/account.service";
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AccountService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit() {


    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'

  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const loginData = this.f;
    this.authenticationService
      .login(loginData['email'].value, loginData['password'].value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log('login-error', error);
          this.error = error;
          this.loading = false;
        },
      );
  }

  fillAdminCredentials() {

  }

  fillUserCredentials() {

  }

  onFacebookLogin() {
    alert('Work In Progress');
  }

  onTwitterLogin() {
    alert('Work In Progress');
  }

  onGoogleLogin() {
    alert('Work In Progress');
  }
}
