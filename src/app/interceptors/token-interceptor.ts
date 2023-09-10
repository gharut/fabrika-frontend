import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AccountService} from "../services/account.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {

    let userData = localStorage.getItem('currentUser')
    if(userData !== null) {
      const currentUser = JSON.parse(userData);
      if (currentUser && currentUser.access_token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentUser.access_token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }
    }
    return next.handle(request);
  }
}
