import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";
import {Client} from "../models/suppliers/client.model";

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl+'/clients'; // Assuming your API base URL

  constructor(private http: HttpClient) { }

  list(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}`);
  }

  updateClient(id: string, client: Client): Observable<{ success: boolean, data: Client }> {
    return this.http.put<{ success: boolean, data: Client }>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/${id}`);
  }

  createClient(client: {}): Observable<{ success: boolean, data: Client }> {
    return this.http.post<{ success: boolean, data: Client }>(`${this.apiUrl}`, client);
  }


}
