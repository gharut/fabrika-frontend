import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = environment.apiUrl+'/roles'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  listRoles(): Observable<Role[]> {
    return this.http.get<{ success: boolean, data: Role[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  listPermissions(): Observable<Permission[]> {
    return this.http.get<{ success: boolean, data: Permission[] }>(`${this.apiUrl}/permissions`)
      .pipe(
        map(response => response.data)
      );
  }

  getRole(id: string): Observable<Role> {
    return this.http.get<{ success: boolean, data: Role }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  updateRole(id: string, role: Role): Observable<{ success: boolean, data: Role }> {
    return this.http.put<{ success: boolean, data: Role }>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  createRole(role: Role): Observable<{ success: boolean, data: Role }> {
    return this.http.post<{ success: boolean, data: Role }>(`${this.apiUrl}`, role);
  }
}
