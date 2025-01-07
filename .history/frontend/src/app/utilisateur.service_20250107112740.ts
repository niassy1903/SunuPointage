import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface LoginResponse {
  token: string;
  utilisateur: any; // Remplace 'any' par le type exact de 'utilisateur' si nécessaire
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://127.0.0.1:8000/api/utilisateurs';
  private apiUrl1 = 'http://127.0.0.1:8000/api';
  private apiUrl2 = 'http://127.0.0.1:8000/api/telephones';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email, mot_de_passe: password };
  
    console.log('Login attempt with body:', body);
  
    return this.http.post<LoginResponse>(`${this.apiUrl1}/login`, body, { headers }).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token); // Sauvegarde du token
          this.redirectBasedOnRole(response.utilisateur); // Rediriger selon le rôle de l'utilisateur
        }
      })
    );
  }
  
  loginByCardId(cardId: string): Observable<LoginResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { card_id: cardId };
  
    console.log('Login attempt with card_id:', body);
  
    return this.http.post<LoginResponse>(`${this.apiUrl1}/login-by-card`, body, { headers }).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (response.token) {
          localStorage.setItem('token', response.token); // Sauvegarde du token
          this.redirectBasedOnRole(response.utilisateur); // Rediriger selon le rôle de l'utilisateur
        }
      })
    );
  }
  
  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    return this.http.post(`${this.apiUrl1}/logout`, {}, { headers }).pipe(
      tap(response => {
        console.log('Logout response:', response);  // Affiche la réponse de la déconnexion
        // Suppression du token ou des informations d'authentification du localStorage ou cookies
        localStorage.removeItem('token');  // Exemple pour un token stocké dans localStorage
        this.router.navigate(['/login']); // Rediriger vers la page de connexion
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

  getListeApprenantsByCohorte(cohorte: string): Observable<any> {
    const encodedCohorte = encodeURIComponent(cohorte);
    return this.http.get<any>(`${this.apiUrl1}/utilisateurs/liste-apprenants-par-cohorte/${encodedCohorte}`);
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

  updatePointage(carte_id: string, pointageData: any): Observable<any> {
    const url = `${this.apiUrl1}/pointages/${carte_id}`;
    return this.http.put<any>(url, pointageData).pipe(
        tap(response => console.log('Pointage updated:', response))
    );
}


    // Récupérer les informations de pointage par carte ID
    getPointageByCardId(cardId: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl1}/pointage/${cardId}`);
    }

    createPointagesBatch(pointagesData: any[]): Observable<any> {
      const url = `${this.apiUrl1}/create-pointage`;
      return this.http.post<any>(url, pointagesData).pipe(
        tap(response => console.log('Pointages batch created:', response))
      );
    }

    
}
