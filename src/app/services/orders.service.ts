import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {Client} from "../models/suppliers/client.model";
import {OrderData} from "../models/order/orderData.model";
import {Role} from "../models/roles/role.model";
import {map} from "rxjs/operators";
import {OrderListItem} from "../models/order/order.list.item";
import {PickupFormModel} from "../models/order/pickup.form.model";
import {PackagingFormModel} from "../models/order/packaging.form.model";
import {Calculation} from "../models/order/calculation.model";

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = environment.apiUrl+'/orders'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  createOrder(data: OrderData): Observable<{ success: boolean; data: any}> {
    return this.http.post<{ success: boolean; data: any}>(`${this.apiUrl}`, data);
  }

  updatePickup(id: number, data: PickupFormModel): Observable<{ success: boolean; data: OrderListItem}> {
    return this.http.put<{ success: boolean; data: OrderListItem}>(`${this.apiUrl}/${id}/pickup`, data);
  }

  updatePackaging(id: number, data: PackagingFormModel): Observable<{ success: boolean; data: OrderListItem}> {
    return this.http.put<{ success: boolean; data: OrderListItem}>(`${this.apiUrl}/${id}/packaging`, data);
  }

  updateStatus(id: number, attribute: string, value: any): Observable<{ success: boolean, data: OrderListItem }> {
    return this.http.put<{ success: boolean; data: OrderListItem}>(`${this.apiUrl}/${id}/status`, {attribute: attribute, value: value});
  }

  getCalculation(id: number): Observable<{ success: boolean; data: Calculation}> {
    return this.http.get<{ success: boolean; data: Calculation}>(`${this.apiUrl}/calculate/${id}`).pipe(
      map(response => response)
    );
  }

  listOrders(): Observable<any> {
    return this.http.get<{ data: OrderListItem[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getOrder(id: number): Observable<any> {
    return this.http.get<{ success: boolean, data: OrderListItem }>(`${this.apiUrl}/`+id)
      .pipe(
        map(response => response)
      );
  }


}
