import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://127.0.0.1:8000/api/utilisateurs';
  private apiUrl1 = 'http://127.0.0.1:8000/api';
  private apiUrl2 = 'http://127.0.0.1:8000/api/telephones';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email, mot_de_passe: password };

    console.log('Login attempt with body:', body); // Vérifie les données envoyées

    return this.http.post(`${this.apiUrl1}/login`, body, { headers }).pipe(
      tap(response => {
        console.log('Login response:', response); // Affiche la réponse du serveur
      })
    );
  }

  loginByCardId(cardId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { card_id: cardId };

    console.log('Login attempt with card_id:', body);

    return this.http.post(`${this.apiUrl1}/login-by-card`, body, { headers }).pipe(
      tap(response => {
        console.log('Login response:', response);
      })
    );
  }

  assignCard(cardId: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { card_id: cardId };

    console.log('Assign card attempt with card_id:', body);

    return this.http.post(`${this.apiUrl1}/assign-card`, body, { headers }).pipe(
      tap(response => {
        console.log('Assign card response:', response);
      })
    );
  }

  getUtilisateursByDepartmentAndFunction(departmentName: string, functionType: string): Observable<any> {
    return this.http.get(`${this.apiUrl1}/employers/${encodeURIComponent(departmentName)}`);
  }

  getApprenantsByCohorte(cohorte: string): Observable<any> {
    const encodedCohorte = encodeURIComponent(cohorte);
    return this.http.get<any>(`${this.apiUrl1}/utilisateurs/apprenants-par-cohorte/${encodedCohorte}`);
  }

  redirectBasedOnRole(utilisateur: any) {
    if (utilisateur.fonction === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (utilisateur.fonction === 'vigile') {
      this.router.navigate(['/dashboard-vigile']);
    }
  }

  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(data => console.log('Données récupérées depuis l\'API :', data)) // Afficher les données récupérées
    );
  }

  createUtilisateur(utilisateur: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, utilisateur);
  }

  updateUtilisateur(id: string, utilisateur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, utilisateur);
  }

  deleteUtilisateur(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  blockUtilisateur(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/bloquer`, {});
  }

  getUtilisateurById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  checkTelephoneExists(telephone: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl2}/${telephone}`);
  }

  checkCardIdExists(cardId: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl1}/check-card-id/${cardId}`);
  }

  createPointage(pointageData: any): Observable<any> {
    const url = `${this.apiUrl1}/pointages`;
    return this.http.post<any>(url, pointageData).pipe(
      tap(response => console.log('Pointage created:', response))
    );
  }

  updatePointage(id: string, pointageData: any): Observable<any> {
    const url = `${this.apiUrl1}/pointages/${id}`;
    return this.http.put<any>(url, pointageData).pipe(
        tap(response => console.log('Pointage updated:', response))
    );
}

    // Récupérer les informations de pointage par carte ID
    getPointageByCardId(cardId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl1}/pointage/${cardId}`);
    }
}
