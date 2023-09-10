import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from "../services/account.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = this.accountService.getRole();

    if (role === 'super-admin') {
      return true;
    }

    const requestedPermission = route.data['permission'];
    const permissions = this.accountService.getPermissions();

    if (!permissions.includes(requestedPermission)) {
      console.log('Unauthorized access (permission)!');
      return false;
    }

    return true;
  }
}
