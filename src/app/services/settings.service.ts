import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Tag, TagWithCount} from "../models/tags/tag.model";
import {Setting} from "../models/settings/setting.model";
import {DeliveryLimits} from "../models/settings/deliveryLimits.model";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = environment.apiUrl+'/settings'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${this.apiUrl}`);
  }

  getByName(name: string): Observable<Setting> {
    return this.http.get<Setting>(`${this.apiUrl}/name/${name}`);
  }

  updateSetting(id: number, setting: Setting): Observable<{ success: boolean, data: Setting }> {
    return this.http.put<{ success: boolean, data: Setting }>(`${this.apiUrl}/${id}`, setting);
  }
  createTag(tag: Tag): Observable<{ success: boolean, data: Tag }> {
    return this.http.post<{ success: boolean, data: Tag }>(`${this.apiUrl}`, tag);
  }


}
