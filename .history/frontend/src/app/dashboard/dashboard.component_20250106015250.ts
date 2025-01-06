import { Component } from '@angular/core';
import { ChartsComponent } from '../component/charts/charts.component';
import { PointageService } from '../pointage.service'; // Import du service PointageService
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface DashboardCard {
  icon: string;
  iconClass: string;
  title: string;
  value: number;
  trend: {
    value: number;
    text: string;
    isPositive: boolean;
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartsComponent, FormsModule, HttpClientModule, CommonModule], // Importation du composant standalone
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
    providers: [PointageService],
  
})
export class DashboardComponent {
  constructor(
    private pointageService: PointageService // Injection du service PointageService
  ) {}

  currentTime: string = '';
  currentDate: string = '';
  totalPointages: number = 0;
  totalValidations: number = 0;
  totalRejets: number = 0;

  updateDateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    this.currentTime = `${hours}:${minutes}:${seconds}`;
    this.currentDate = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    // Recharger les données des pointages à chaque changement de date
    this.loadPointagesData();
  }
  
  loadPointagesData() {
    const today = new Date().toISOString().split('T')[0]; // Format: '2025-01-03'

    // Récupérer le total des pointages
    this.pointageService.getTotalPointages(today).subscribe(
      (data) => {
        this.totalPointages = data.total_pointages; // Mettez à jour la variable totalPointages
      },
      (error) => {
        console.error('Erreur lors de la récupération des pointages :', error);
      }
    );

    // Récupérer le total des pointages validés
    this.pointageService.getTotalValidations(today).subscribe(
      (data) => {
        this.totalValidations = data.total_validations; // Mettez à jour la variable totalValidations
      },
      (error) => {
        console.error('Erreur lors de la récupération des validations :', error);
      }
    );

    // Récupérer le total des pointages rejetés
    this.pointageService.getTotalRejets(today).subscribe(
      (data) => {
        this.totalRejets = data.total_rejets; // Mettez à jour la variable totalRejets
      },
      (error) => {
        console.error('Erreur lors de la récupération des rejets :', error);
      }
    );
}

  cards: DashboardCard[] = [
    {
      icon: 'bi bi-people',
      iconClass: 'bg-light-primary',
      title: 'Total Employees',
      value: 452,
      trend: {
        value: 2,
        text: 'nouveaux employés !',
        isPositive: true
      }
    },
    {
      icon: 'bi bi-person-check',
      iconClass: 'bg-light-success',
      title: 'A l\'heure',
      value: 360,
      trend: {
        value: 10,
        text: 'Moins qu\'hier',
        isPositive: false
      }
    },
    {
      icon: 'bi bi-person-x',
      iconClass: 'bg-light-danger',
      title: 'Absent',
      value: 30,
      trend: {
        value: 3,
        text: 'Augmentation par rapport à hier',
        isPositive: false
      }
    },
    {
      icon: 'bi bi-clock-history',
      iconClass: 'bg-light-warning',
      title: 'Arrivée tardive',
      value: 62,
      trend: {
        value: 13,
        text: 'Augmentation par rapport à hier',
        isPositive: false
      }
    },
    {
      icon: 'bi bi-box-arrow-right',
      iconClass: 'bg-light-info',
      title: 'Départs anticipés',
      value: 6,
      trend: {
        value: 10,
        text: 'Moins qu\'hier',
        isPositive: true
      }
    },
    {
      icon: 'bi bi-clock',
      iconClass: 'bg-light-secondary',
      title: 'Départs Tardives',
      value: 42,
      trend: {
        value: 2,
        text: 'Augmentation par rapport à hier',
        isPositive: false
      }
    }
  ];
}
