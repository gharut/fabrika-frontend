import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Tag, TagWithCount} from "../models/tags/tag.model";
import {Supplier} from "../models/suppliers/supplier.model";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = environment.apiUrl+'/supplier'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}`);
  }

  updateSupplier(id: string, supplier: Supplier): Observable<{ success: boolean, data: Supplier }> {
    return this.http.put<{ success: boolean, data: Supplier }>(`${this.apiUrl}/${id}`, supplier);
  }

  deleteSupplier(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: {}): Observable<{ success: boolean, data: Supplier }> {
    return this.http.post<{ success: boolean, data: Supplier }>(`${this.apiUrl}`, supplier);
  }


}
