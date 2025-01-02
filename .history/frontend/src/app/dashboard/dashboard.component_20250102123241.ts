import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      // Graphique de présence
      const presenceCtx = document.getElementById('presenceChart') as HTMLCanvasElement;
      if (presenceCtx) {
        new Chart(presenceCtx, {
          type: 'line',
          data: {
            labels: ['01Aout', '02Aout', '03Aout', '04Aout', '05Aout', '06Aout', '07Aout', '08Aout', '09Aout', '10Aout'],
            datasets: [{
              label: 'Présence (%)',
              data: [85, 90, 78, 88, 92, 85, 87, 95, 80, 91],
              borderColor: '#8DBB36',
              backgroundColor: 'rgba(141, 187, 54, 0.2)',
              fill: true
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Jour'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Tableau de Comparaison des présences (%)'
                },
                min: 0,
                max: 100
              }
            }
          }
        });
      }

      // Graphique de fréquentation hebdomadaire
      const weeklyCtx = document.getElementById('weeklyChart') as HTMLCanvasElement;
      if (weeklyCtx) {
        new Chart(weeklyCtx, {
          type: 'bar',
          data: {
            labels: ['Adefnipa', 'IT', 'IOT'],
            datasets: [{
              label: 'Fréquentation (%)',
              data: [80, 70, 90],
              backgroundColor: ['#8DBB36', '#E6EEF5', '#E6EEF5']
            }]
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Catégories'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Fréquentation Hebdomadaire (%)'
                },
                min: 0,
                max: 100
              }
            }
          }
        });
      }
    }
  }


}
