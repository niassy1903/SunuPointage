import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent {
  // Données pour le graphique en ligne
  public lineChartData = {
    datasets: [
      {
        data: [60, 70, 80, 91, 65, 75, 50, 70],
        label: 'Présences',
        fill: true,
        tension: 0.3,
        backgroundColor: 'rgba(144, 238, 144, 0.3)',
        borderColor: '#90EE90',
        pointBackgroundColor: '#90EE90',
      },
    ],
    labels: ['01 Aug', '02 Aug', '03 Aug', '04 Aug', '07 Aug', '09 Aug', '14 Aug', '16 Aug'],
  };

  // Données pour le graphique en barres
  public barChartData = {
    datasets: [
      {
        data: [40, 70, 86, 70, 50],
        label: 'Fréquentation',
        backgroundColor: ['#d3d3d3', '#d3d3d3', '#90EE90', '#d3d3d3', '#d3d3d3'],
      },
    ],
    labels: ['admin', 'IT', 'Marketing', 'RD/Digital', 'Sass'],
  };

  // Options pour les graphiques
  public lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  public barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  public lineChartType: any = 'line';
  public barChartType: any = 'bar';

  // Filtre sélectionné
  public selectedFilter = 'Quotidienne';

  // Méthode pour appliquer le filtre
  applyFilter(filter: string) {
    this.selectedFilter = filter;
    if (filter === 'Quotidienne') {
      this.lineChartData.datasets[0].data = [60, 70, 80, 91, 65, 75, 50, 70];
    } else if (filter === 'Hebdomadaire') {
      this.lineChartData.datasets[0].data = [70, 80, 90, 85, 75, 60, 50];
    } else if (filter === 'Mensuelle') {
      this.lineChartData.datasets[0].data = [65, 75, 85, 95, 85, 70, 60];
    }
  }
}
