import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})

export class ResetPasswordComponent implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Récupérer le token et l'email depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  resetPassword() {
    // Vérification si les mots de passe correspondent
    if (this.newPassword !== this.confirmPassword) {
      this.message = "Les mots de passe ne correspondent pas.";
      return;
    }

    // Appeler l'API de Laravel pour réinitialiser le mot de passe
    this.authService.resetPassword(this.email, this.token, this.newPassword, this.confirmPassword).subscribe(
      (response) => {
        this.message = "Mot de passe réinitialisé avec succès.";
        this.router.navigate(['/login']);
      },
      (error) => {
        this.message = "Erreur lors de la réinitialisation du mot de passe.";
      }
    );
  }
}
