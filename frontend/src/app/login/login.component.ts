import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule, JwtModule],
  providers: [UtilisateurService]
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  cardId: string = '';
  passwordVisible: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  emailError: string = '';
  passwordError: string = '';
  ws!: WebSocket;

  constructor(private utilisateurService: UtilisateurService, private router: Router) { }

  ngOnInit() {
    this.ws = new WebSocket('ws://localhost:8080');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'cardRead') {
        this.cardId = data.cardId;
        this.confirmCardLogin();
      }
    };
  }

  confirmCardLogin() {
    this.utilisateurService.loginByCardId(this.cardId).subscribe(
      response => {
        console.log('Login successful', response);
        if (response.utilisateur.fonction === 'admin') {
          this.successMessage = 'Connexion réussie';
          this.utilisateurService.redirectBasedOnRole(response.utilisateur);
        } else {
          this.errorMessage = 'Accès non autorisé';
        }
      },
      error => {
        console.error('Login failed', error);
        if (error.status === 404) {
          this.errorMessage = 'Carte ID non trouvée';
        } else if (error.status === 403) {
          this.errorMessage = 'Accès non autorisé';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    );
  }
  onSubmit() {
    if (this.emailError || this.passwordError) {
      return;
    }

    this.utilisateurService.login(this.email, this.password).subscribe(
      response => {
        console.log('Login successful', response);
        this.successMessage = 'Connexion réussie';
        this.utilisateurService.redirectBasedOnRole(response.utilisateur);
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = error;
      }
    );
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Email invalide';
    } else {
      this.emailError = '';
    }
  }

  validatePassword() {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(this.password)) {
      this.passwordError = 'Mot de passe invalide';
    } else {
      this.passwordError = '';
    }
  }
}
