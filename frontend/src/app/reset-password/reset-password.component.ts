import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  providers: [AuthService] // Ajoute ton service ici si nécessaire
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';
  error: string = ''; // Pour gérer les erreurs globales
  passwordError: string = ''; // Pour le champ du mot de passe
  confirmPasswordError: string = ''; // Pour le champ de confirmation
  showPassword: boolean = false; // Contrôle la visibilité du mot de passe
  showConfirmPassword: boolean = false; // Contrôle la visibilité de la confirmation

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer le token et l'email depuis l'URL
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  resetPassword(): void {
    // Réinitialiser les erreurs
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.error = '';
    this.message = '';
  
    // Validation
    if (this.newPassword.length < 8) {
      this.passwordError = 'Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }
  
    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = 'Les mots de passe ne correspondent pas.';
      return;
    }
  
    // Appeler l'API pour réinitialiser le mot de passe
    this.authService.resetPassword(this.email, this.token, this.newPassword, this.confirmPassword).subscribe(
      (response) => {
        this.message = 'Mot de passe réinitialisé avec succès.';
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirection après 2s
      },
      (error) => {
        // Gérer les erreurs spécifiques envoyées par l'API
        if (error.status === 422 && error.error.errors) {
          const errors = error.error.errors;
          this.passwordError = errors.password ? errors.password[0] : '';
          this.error = errors.token ? errors.token[0] : 'Erreur inconnue.';
        } else {
          this.error = 'Erreur lors de la réinitialisation du mot de passe.';
        }
      }
    );
  }
  
}
