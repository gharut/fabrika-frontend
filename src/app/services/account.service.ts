import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {Account} from "../models/account/account.model";
import {Router} from "@angular/router";
import {Role} from "../models/roles/role.model";

@Injectable({providedIn: 'root'})
export class AccountService {
  private accountSubject: BehaviorSubject<Account | null>;
  public account: Observable<Account | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.accountSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')!));
    this.account = this.accountSubject.asObservable();
  }

  update(data: any) {
    return this.http.put<{success:boolean,data:Account}>(`${environment.apiUrl}/profile`, data)
      .pipe(map(response => {
        if (response.success) {
          response.data.access_token = this.accountSubject.getValue()?.access_token ?? "";
          const user = {...this.account, ...response.data};
          localStorage.setItem('currentUser', JSON.stringify(response.data));

          this.accountSubject.next(user);
        }
        return response;
      }));
  }

  reset(data: any): Observable<{ success: boolean }>{
    let httpHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<{success: boolean}>(`${environment.apiUrl}/auth/reset-password`, data, { headers: httpHeaders });
  }

  login(email: string, password: string) {
    return this.http
      .post<{success:boolean,data:Account}>(environment.apiUrl+'/auth/login', {
        email: email.trim(),
        password: password.trim(),
      })
      .pipe(
        map(response => {
          if (response && response.data.access_token) {
            let role = {name:"", visible_name: ""};

            localStorage.setItem(
              'currentUser',
              JSON.stringify(response.data),
            );
          }
        }),
      );
  }

  getAvatar() {

  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  getPermissions(): string[] {
    return this.accountSubject.value?.permissions ?? []
  }

  getRole() {
    return this.accountSubject.value?.role.name ?? ""
  }

  can(permission: string): boolean {
    if(this.getRole() === "super-admin") {
      return true
    }

    return this.getPermissions().includes(permission)
  }

  canOneOf(list: string[]): boolean {
    if(this.getRole() === "super-admin") {
      return true
    }

    const permissions = this.getPermissions()
    let result = false
    list.forEach( (permission) => {
      if(permissions.includes(permission)) {
        result = true
        return
      }
    });

    return result
  }

  canAll(list: string[]): boolean {
    if(this.getRole() === "super-admin") {
      return true
    }

    const permissions = this.getPermissions()
    let result = true
    list.forEach( (permission) => {
      if(!permissions.includes(permission)) {
        result = false
        return
      }
    });

    return result
  }
}
