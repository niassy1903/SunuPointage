// src/app/forgot-password/forgot-password.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  email: string = ''; // L'email de l'utilisateur
  message: string = ''; // Message de succès
  error: string = ''; // Message d'erreur

  constructor(private authService: AuthService) {}

  // Méthode pour envoyer l'email et demander la réinitialisation
  onForgotPassword(): void {
    this.authService.forgotPassword(this.email).subscribe(
      response => {
        this.message = response.message; // Message de succès
        this.error = ''; // Réinitialiser les erreurs
      },
      error => {
        this.error = error.error.message; // Message d'erreur
        this.message = ''; // Réinitialiser le message de succès
      }
    );
  }
}
