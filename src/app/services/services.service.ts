import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Tag, TagWithCount} from "../models/tags/tag.model";
import {Service} from "../models/services/service.model";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = environment.apiUrl+'/services'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Service[]> {
    return this.http.get<Service[]>(`${this.apiUrl}`);
  }

  updateService(id: string, service: any): Observable<{ success: boolean, data: Service }> {
    return this.http.put<{ success: boolean, data: any }>(`${this.apiUrl}/${id}`, service);
  }

  deleteService(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  createService(data: any): Observable<{ success: boolean, data: any }> {
    return this.http.post<{ success: boolean, data: any }>(`${this.apiUrl}`, data);
  }


}
