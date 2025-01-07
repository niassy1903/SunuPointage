import { Component, OnInit } from '@angular/core';
import { PointageService } from '../../pointage.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  standalone: true,
  imports : [CommonModule, FormsModule, NgChartsModule]
})
export class ChartsComponent implements OnInit {
  public lineChartData = {
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        label: 'Présences',
        fill: true,
        tension: 0.3,
        backgroundColor: 'rgba(144, 238, 144, 0.3)',
        borderColor: '#90EE90',
        pointBackgroundColor: '#90EE90',
      },
    ],
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
  };

  public lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
      },
    },
  };

  public lineChartType: 'line' = 'line';

  public selectedFilter: string = 'Quotidienne'; // Par défaut
  public barChartData = {
    datasets: [
      {
        data: [5, 10, 15, 20, 25],
        label: 'Retards',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
  };

  public barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
      },
    },
  };

  public barChartType: 'bar' = 'bar';

  constructor(private pointageService: PointageService) {}

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    const dates = this.getDatesForCurrentWeek();
    const presenceData: number[] = [0, 0, 0, 0, 0, 0, 0];

    dates.forEach((date, index) => {
        // Convertir la date au format ISO 8601 avec fuseau horaire
        const formattedDate = new Date(date).toISOString();  // Cela donne un format comme '2025-01-06T00:00:00.000Z'
        console.log('Date envoyée à l\'API : ', formattedDate);  // Ajout d'un log pour vérifier la date

        this.pointageService.getDailyPresenceCount(formattedDate).subscribe({
            next: (response) => {
                presenceData[index] = response.daily_presence_count || 0;
                if (index === dates.length - 1) {
                    this.lineChartData.datasets[0].data = presenceData;
                }
            },
            error: (err) => {
                console.error(`Erreur lors du chargement des données pour la date ${formattedDate}:`, err);
            },
        });
    });
}



getDatesForCurrentWeek(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const firstDay = new Date(today);
  firstDay.setDate(today.getDate() - today.getDay() + 1); // Lundi

  for (let i = 0; i < 7; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + i);
      // Format 'YYYY-MM-DD' sans heure
      dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

  applyFilter(filter: string) {
    this.selectedFilter = filter;
    console.log(`Filtre appliqué : ${filter}`);
    // Vous pouvez ajouter une logique ici pour filtrer les données en fonction du filtre sélectionné
  }
}
