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
