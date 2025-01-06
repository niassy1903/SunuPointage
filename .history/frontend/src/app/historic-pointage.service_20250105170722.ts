import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoricPointageService {
  private baseUrl = 'http://localhost:8000/api/historic-pointages'; // Remplacez par l'URL correcte de votre API backend

  constructor(private http: HttpClient) {}

  /**
   * Obtenir la liste des historiques
   */
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  /**
   * Obtenir un historique spécifique
   * @param id Identifiant de l'historique
   */
  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  /**
   * Créer un nouvel historique
   * @param data Données pour l'historique
   */
  create(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, data);
  }

  /**
   * Mettre à jour un historique
   * @param id Identifiant de l'historique
   * @param data Données mises à jour
   */
  update(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Supprimer un historique
   * @param id Identifiant de l'historique
   */
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
