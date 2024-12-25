import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private apiUrl = 'http://127.0.0.1:8000/api/departements';

  constructor(private http: HttpClient) { }

  getDepartements(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  addDepartement(departement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, departement);
  }
}
