import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-vigile',
  imports: [],
  templateUrl: './dashboard-vigile.component.html',
  styleUrl: './dashboard-vigile.component.css'
})
export class DashboardVigileComponent implements OnInit {
  currentTime: string = '';
  currentDate: string = '';

  ngOnInit(): void {
    // Mettre à jour l'heure toutes les secondes
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString(); // Heure actuelle (format 12h/24h selon la langue du navigateur)
      this.currentDate = now.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }); // Date actuelle au format français
    }, 1000);
  }
}
