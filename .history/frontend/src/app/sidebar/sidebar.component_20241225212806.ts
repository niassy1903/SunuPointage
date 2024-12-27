import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {}

  // Fonction pour rediriger vers Dashboard
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  goToDashboardVigile() {
    this.router.navigate(['/dashboardVigile']);
  }

  // Fonction pour rediriger vers Présence
  goToPresence() {
    this.router.navigate(['/presence']);
  }

  // Fonction pour rediriger vers Utilisateurs
  goToUsers() {
    this.router.navigate(['/utilisateur']);
  }

  // Fonction pour rediriger vers Paramètres
  goToSettings() {
    this.router.navigate(['/parametres']);
  }

  goToDepartement () {
    this.router.navigate(['/departement']);
  }

  goToCohorte(){
  this.router.navigate(['/cohorte']);
  }

  goToHistorique(){

    this.router.navigate(['/historique']);
  }

  logout(){

    this.router.navigate(['/login']);
  }

}
