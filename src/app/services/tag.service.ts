import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Tag, TagWithCount} from "../models/tags/tag.model";

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private apiUrl = environment.apiUrl+'/tag'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.apiUrl}`);
  }

  listWithCounts(): Observable<TagWithCount[]> {
    return this.http.get<TagWithCount[]>(`${this.apiUrl}/list`);
  }

  getTag(id: string): Observable<Tag> {
    return this.http.get<{ success: boolean, data: Tag }>(`${this.apiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  updateTag(id: string, tag: TagWithCount): Observable<{ success: boolean, data: TagWithCount }> {
    return this.http.put<{ success: boolean, data: Tag }>(`${this.apiUrl}/${id}`, tag);
  }

  deleteTag(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  createTag(tag: Tag): Observable<{ success: boolean, data: Tag }> {
    return this.http.post<{ success: boolean, data: Tag }>(`${this.apiUrl}`, tag);
  }


}
