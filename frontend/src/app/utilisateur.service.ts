import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { catchError  } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
          localStorage.setItem('user', JSON.stringify(response.utilisateur)); // Sauvegarde de l'utilisateur
        }
      }),
      catchError(error => {
        if (error.status === 403 && error.error.message === 'Compte bloqué. Veuillez contacter l\'administration.') {
          return throwError('Compte bloqué. Veuillez contacter l\'administration.');
        }
        return throwError(error);
      })
    );
  }

  redirectBasedOnRole(utilisateur: any) {
    if (utilisateur.fonction === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (utilisateur.fonction === 'vigile') {
      this.router.navigate(['/dashboard-vigile']);
    }
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
          localStorage.setItem('user', JSON.stringify(response.utilisateur)); // Sauvegarde de l'utilisateur
          console.log('User saved to localStorage:', response.utilisateur);
        }
      }),
      catchError(error => {
        if (error.status === 403 && error.error.message === 'Compte bloqué. Veuillez contacter l\'administration.') {
          return throwError('Compte bloqué. Veuillez contacter l\'administration.');
        }
        return throwError(error);
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(`${this.apiUrl1}/logout`, {}, { headers }).pipe(
      tap(response => {
        console.log('Logout response:', response);
        localStorage.removeItem('token');  // Suppression du token
        localStorage.removeItem('user');   // Suppression de l'utilisateur
        this.router.navigate(['/login']);  // Rediriger vers la page de connexion
      })
    );
  }

  isUserLoggedInAndHasRole(): boolean {
    const token = localStorage.getItem('token');  // Vérifie si le token est présent
    console.log('Token:', token);

    if (!token) {
      console.log('No token found');
      return false;  // Si le token n'existe pas, l'utilisateur n'est pas connecté
    }

    const utilisateur = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User:', utilisateur);

    if (utilisateur && (utilisateur.fonction === 'admin' || utilisateur.fonction === 'vigile')) {
      console.log('User is logged in and has the correct role');
      return true;  // Si l'utilisateur est connecté et son rôle est 'admin' ou 'vigile'
    }

    console.log('User does not have the correct role');
    return false;  // Si l'utilisateur n'a pas le bon rôle
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
    return this.http.get<{ exists: boolean }>(`${this.apiUrl1}/check-telephone/${telephone}`);

  }

  checkEmailExists(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl1}/check-email/${email}`);
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

  getPointageByCardId(cardId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/pointage/${cardId}`);
  }

  createPointagesBatch(pointagesData: any[]): Observable<any> {
    const url = `${this.apiUrl1}/create-pointage`;
    return this.http.post<any>(url, pointagesData).pipe(
      tap(response => console.log('Pointages batch created:', response))
    );
  }

  getNumberOfEmployers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}/utilisateurs/employers/count`).pipe(
      tap(response => {
        console.log('Nombre d\'employeurs récupéré:', response);
      })
    );
  }

  reactiverUtilisateur(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/reactiver`; // L'URL pour réactiver l'utilisateur
    return this.http.patch<any>(url, {}).pipe(
      tap(response => console.log(`Utilisateur ${id} réactivé avec succès:`, response)),
      catchError(error => {
        console.error(`Erreur lors de la réactivation de l'utilisateur ${id}:`, error);
        return throwError(error); // Propager l'erreur
      })
    );
  }


  




  // Méthode pour bloquer plusieurs utilisateurs
  blockUtilisateurs(ids: string[]): Observable<any> {
    const url = `${this.apiUrl}/bloquer-multiple`; // Assurez-vous que l'URL correspond à celle définie dans l'API Laravel
    const body = { ids }; // Envoie les IDs dans le corps de la requête
    return this.http.post<any>(url, body).pipe(
      tap(response => console.log('Utilisateurs bloqués avec succès:', response)),
      catchError(error => {
        console.error('Erreur lors du blocage des utilisateurs:', error);
        return throwError(error); // Propager l'erreur
      })
    );
  }

  // Méthode pour réactiver plusieurs utilisateurs
  reactiverUtilisateurs(ids: string[]): Observable<any> {
    const url = `${this.apiUrl}/reactiver-multiple`; // Assurez-vous que l'URL correspond à celle définie dans l'API Laravel
    const body = { ids }; // Envoie les IDs dans le corps de la requête
    return this.http.post<any>(url, body).pipe(
      tap(response => console.log('Utilisateurs réactivés avec succès:', response)),
      catchError(error => {
        console.error('Erreur lors de la réactivation des utilisateurs:', error);
        return throwError(error); // Propager l'erreur
      })
    );
  }

  
}
