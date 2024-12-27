import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-vigile',
  standalone: true,
  templateUrl: './dashboard-vigile.component.html',
  styleUrls: ['./dashboard-vigile.component.css'],
  imports: [CommonModule], // Ajoutez des modules nécessaires ici
})
export class DashboardVigileComponent implements OnInit {
  currentTime: string = '';
  currentDate: string = '';

  ngOnInit(): void {
    console.log('DashboardVigileComponent loaded');
    setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
      this.currentDate = now.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }, 1000);
  }
}
