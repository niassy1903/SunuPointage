import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointageService {
  private apiUrl = 'http://localhost:8000/api'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) {}

  // Récupérer tous les pointages
  getAllPointages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pointages`);
  }

   // Méthode pour mettre à jour le statut de pointage
   updatePointageStatus(cardId: string, status: string): Observable<any> {
    const url = `${this.apiUrl}/pointages/update-status/${cardId}`;
    const body = { statut: status };  // Le corps de la requête contient le statut

    return this.http.put<any>(url, body);  // Envoie la requête PUT
  }

  // Récupérer un pointage spécifique par ID
  getPointageById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pointages/${id}`);
  }

  // Récupérer un pointage par carte ID
  getPointageByCardId(cardId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pointage/${cardId}`);
  }

  // Récupérer le total des pointages par jour
  getTotalPointages(date?: string): Observable<any> {
    const params = date ? new HttpParams().set('date', date) : undefined;
    return this.http.get(`${this.apiUrl}/pointages/totals`, { params });
  }

  // Récupérer le total des pointages validés par jour
  getTotalValidations(date?: string): Observable<any> {
    const params = date ? new HttpParams().set('date', date) : undefined;
    return this.http.get(`${this.apiUrl}/pointages/validations`, { params });
  }

  // Récupérer le total des pointages rejetés par jour
  getTotalRejets(date?: string): Observable<any> {
    const params = date ? new HttpParams().set('date', date) : undefined;
    return this.http.get(`${this.apiUrl}/pointages/rejets`, { params });
  }

  // Ajouter un nouveau pointage
  createPointage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pointages`, data);
  }

  // Mettre à jour un pointage existant
  updatePointage(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pointages/${id}`, data);
  }
}
