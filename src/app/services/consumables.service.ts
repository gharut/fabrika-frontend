import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Tag, TagWithCount} from "../models/tags/tag.model";
import {Consumable} from "../models/consumables/consumable.model";

@Injectable({
  providedIn: 'root'
})
export class ConsumablesService {
  private apiUrl = environment.apiUrl+'/consumables'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Consumable[]> {
    return this.http.get<Consumable[]>(`${this.apiUrl}`);
  }

  getTag(id: string): Observable<Tag> {
    return this.http.get<{ success: boolean, data: Tag }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  updateConsumable(id: string, consumable: any): Observable<{ success: boolean, data: Consumable }> {
    console.log(id)
    return this.http.put<{ success: boolean, data: Consumable }>(`${this.apiUrl}/${id}`, consumable);
  }

  deleteConsumable(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  createConsumable(data: any): Observable<{ success: boolean, data: Consumable }> {
    return this.http.post<{ success: boolean, data: Consumable }>(`${this.apiUrl}`, data);
  }


}
