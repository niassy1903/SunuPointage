// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api'; // Assurez-vous que l'URL du backend est correcte

  constructor(private http: HttpClient) { }

  // Demander un lien de réinitialisation du mot de passe
  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/password/forgot`, { email });
  }

  // Réinitialiser le mot de passe

  resetPassword(email: string, token: string, newPassword: string, confirmPassword: string): Observable<any> {
    const body = {
      email: email,
      token: token,
      password: newPassword,
      password_confirmation: confirmPassword,
    };

    return this.http.post(`${this.apiUrl}/password/reset`, body);
  }
}
