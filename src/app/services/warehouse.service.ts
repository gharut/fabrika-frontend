import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import { Warehouse } from "../models/warehouses/warehouse.model";
import {CreateWarehouse} from "../models/warehouses/create-warehouse.model";
import {UpdateWarehouse} from "../models/warehouses/update-warehouse.model";
import {WarehouseSelections} from "../models/warehouses/warehouse-selections.model";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = environment.apiUrl + '/warehouses';

  constructor(private http: HttpClient) { }

  list(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.apiUrl}`);
  }

  getSelections(): Observable<WarehouseSelections> {
    return this.http.get<any>(`${this.apiUrl}/get-selections`);
  }

  createWarehouse(warehouse: CreateWarehouse): Observable<{ success: boolean, data: Warehouse }> {
    return this.http.post<{ success: boolean, data: Warehouse }>(`${this.apiUrl}`, warehouse);
  }

  updateWarehouse(id: string, warehouse: UpdateWarehouse): Observable<{ success: boolean, data: Warehouse }> {
    return this.http.put<{ success: boolean, data: Warehouse }>(`${this.apiUrl}/${id}`, warehouse);
  }

  deleteWarehouse(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }
}
