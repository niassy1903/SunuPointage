import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../utilisateur.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';  // Import du module HttpClientModule



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  providers: [UtilisateurService]
})
export class NavbarComponent implements OnInit {
  utilisateur: any = null;  // Initialisez une variable pour stocker les informations de l'utilisateur

  constructor(private utilisateurService: UtilisateurService) {}

  ngOnInit(): void {
    this.loadUserInfo();  // Chargez les informations de l'utilisateur lors de l'initialisation du composant
  }

  loadUserInfo(): void {
    // Récupérez l'utilisateur du localStorage
    this.utilisateur = JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Optionnel : vous pouvez ajouter des méthodes pour manipuler les données de l'utilisateur
}
