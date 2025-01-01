import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointageService {
  private apiUrl = 'http://localhost:8000/api/pointages'; // Remplacez par l'URL de votre API Laravel

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les pointages
  getPointages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Méthode pour mettre à jour le statut de pointage
  updatePointageStatus(cardId: string, status: string): Observable<any> {
    const url = `${this.apiUrl}/update-status/${cardId}`;
    const body = { statut: status };  // Le corps de la requête contient le statut

    return this.http.put<any>(url, body);  // Envoie la requête PUT
  }
}
