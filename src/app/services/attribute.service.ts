import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, Permission } from '../models/roles/role.model'
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {Attribute} from "../models/attributes/attribute.model";

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private apiUrl = environment.apiUrl+'/attributes'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Attribute[]> {
    return this.http.get<{ data: Attribute[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }
}
