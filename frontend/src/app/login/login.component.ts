import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [UtilisateurService]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private utilisateurService: UtilisateurService, private router: Router) { }

  // Fonction déclenchée lors de la soumission du formulaire
  onSubmit() {
    console.log('Form submitted with email:', this.email, 'and password:', this.password); // Vérifie les valeurs envoyées
  
    this.utilisateurService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response); // Vérifie la réponse du serveur
        this.successMessage = 'Connexion réussie';
        this.redirectBasedOnRole(response.utilisateur);
      },
      error => {
        console.error('Login failed', error); // Affiche l'erreur
  
        if (error.status === 401) {
          console.log('Invalid credentials error'); // Vérifie si l'erreur est liée à une authentification incorrecte
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 403) {
          console.log('Access denied error'); // Vérifie si l'erreur est liée à un accès non autorisé
          this.errorMessage = 'Accès non autorisé';
        } else {
          console.log('Other error:', error); // Affiche les autres erreurs
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    );
  }
  
  // Afficher/Masquer le mot de passe
  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  // Rediriger en fonction du rôle de l'utilisateur
  redirectBasedOnRole(utilisateur: any) {
    if (utilisateur.fonction === 'admin') {
      this.router.navigate(['/dashboard']);
    } else if (utilisateur.fonction === 'vigile') {
      this.router.navigate(['/vigile']);
    }
  }
}
