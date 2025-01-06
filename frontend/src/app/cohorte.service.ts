import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CohorteService {
  private baseUrl = 'http://localhost:8000/api/cohortes'; // Remplacez par l'URL de votre API

  constructor(private http: HttpClient) {}

  getCohortes(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getAllCohortes(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  createCohorte(cohorte: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, cohorte);
  }

  getCohorteById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateCohorte(id: number, cohorte: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, cohorte);
  }

  deleteCohorte(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
