import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private apiUrl = 'http://127.0.0.1:8000/api/utilisateurs';

  private apiUrl1 = 'http://127.0.0.1:8000/api';
  

 

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

getUtilisateursByDepartment(departmentId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl1}/departements/${departmentId}`);
}

getUtilisateursByDepartmentAndFunction(departmentId: string, functionName: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl1}/departements/${departmentId}/function/${functionName}`);
}
  redirectBasedOnRole(utilisateur: any) {
    if (utilisateur.fonction === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (utilisateur.fonction === 'vigile') {
      this.router.navigate(['/vigile']);
    }
  }

  getUtilisateurs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
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
}
