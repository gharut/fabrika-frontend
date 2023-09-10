import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";

import { AccountService} from "../services/account.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AccountService, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        console.log('error', err);

        if (err.status === 401) {
          // auto logout if 401 response returned from api
          //this.authenticationService.logout();
          //location.reload();
        }
        if (err.status === 403) {
          this.toastr.warning("Свяжитесь с администратором","У вас нет прав для выполнеиня этой операции.")
        }

        const error = err.error.message || err.error;
        return throwError(error);
      })
    );
  }
}
