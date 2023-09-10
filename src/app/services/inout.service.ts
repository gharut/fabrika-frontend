import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Tag, TagWithCount} from "../models/tags/tag.model";
import {Supplier} from "../models/suppliers/supplier.model";
import {ConsumableHistoryItemModel} from "../models/consumables/consumableHistoryItem.model";

@Injectable({
  providedIn: 'root'
})
export class InoutService {
  private apiUrl = environment.apiUrl; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  getAll(pageOffset: any, page: any, orderBy?: any): Observable<any> {
    const params = new HttpParams({
      fromObject: {pageOffset, page, orderBy}
    });

    return this.http.get(`${this.apiUrl}/inout`, {params: params ? params : {}});
  }

  listWaiting(): Observable<ConsumableHistoryItemModel[]> {
    return this.http.get<ConsumableHistoryItemModel[]>(`${this.apiUrl}/inout/waiting`);
  }

  inout(id: string, data: any): Observable<{ success: boolean, data: any }> {
    return this.http.post<{ success: boolean, data: any }>(`${this.apiUrl}/consumables/${id}/inout`, data);
  }

  setPaid(id: string): Observable<{ success: boolean}> {
    return this.http.post<{ success: boolean}>(`${this.apiUrl}/inout/${id}/paid`, {});
  }

  setDelivered(id: string): Observable<{ success: boolean}> {
    return this.http.post<{ success: boolean}>(`${this.apiUrl}/inout/${id}/delivered`, {});
  }


}
