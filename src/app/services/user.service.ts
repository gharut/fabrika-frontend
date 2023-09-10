import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Role} from "../models/roles/role.model";
import {map} from "rxjs/operators";
import {User} from "../models/users/user.model";
import {NewUser} from "../models/users/newUser.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl+'/users'; // Assuming your API base URL
  constructor(private http: HttpClient) { }

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: NewUser): Observable<{ success: boolean, data: User }> {
    return this.http.post<{ success: boolean, data: User }>(`${this.apiUrl}`, user);
  }

  updateUser(user: User): Observable<{ success: boolean, data: User }> {
    return this.http.put<{ success: boolean, data: User }>(`${this.apiUrl}/${user.id}`, user);
  }

  deleteUser(id: any): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
