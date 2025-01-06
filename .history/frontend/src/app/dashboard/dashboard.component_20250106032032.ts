import { Component, OnInit } from '@angular/core';
import { PointageService } from '../pointage.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from '../component/charts/charts.component';

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
  imports: [FormsModule, ChartsComponent, HttpClientModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [PointageService],
})
export class DashboardComponent implements OnInit {
  currentTime: string = new Date().toLocaleTimeString(); // Heure actuelle
  currentDate: string = new Date().toISOString().split('T')[0]; // Date au format ISO: 'YYYY-MM-DD'

  totalPointages: number = 0;
  totalValidations: number = 0;
  totalRejets: number = 0;

  cards: DashboardCard[] = [
    {
      icon: 'bi bi-people',
      iconClass: 'bg-light-primary',
      title: 'Total Employees',
      value: 452,
      trend: {
        value: 2,
        text: 'nouveaux employés !',
        isPositive: true,
      },
    },
    {
      icon: 'bi bi-person-check',
      iconClass: 'bg-light-success',
      title: 'A l\'heure',
      value: 360,
      trend: {
        value: 10,
        text: 'Moins qu\'hier',
        isPositive: false,
      },
    },
    {
      icon: 'bi bi-person-x',
      iconClass: 'bg-light-danger',
      title: 'Absent',
      value: 30,
      trend: {
        value: 3,
        text: 'Augmentation par rapport à hier',
        isPositive: false,
      },
    },
    {
      icon: 'bi bi-clock-history',
      iconClass: 'bg-light-warning',
      title: 'Arrivée tardive',
      value: 62,
      trend: {
        value: 13,
        text: 'Augmentation par rapport à hier',
        isPositive: false,
      },
    },
    {
      icon: 'bi bi-box-arrow-right',
      iconClass: 'bg-light-info',
      title: 'Départs anticipés',
      value: 6,
      trend: {
        value: 10,
        text: 'Moins qu\'hier',
        isPositive: true,
      },
    },
    {
      icon: 'bi bi-clock',
      iconClass: 'bg-light-secondary',
      title: 'Départs Tardives',
      value: 42,
      trend: {
        value: 2,
        text: 'Augmentation par rapport à hier',
        isPositive: false,
      },
    },
  ];

  constructor(private pointageService: PointageService) {}

  ngOnInit() {
    // Appel de la méthode pour récupérer les statistiques des pointages par statut
    this.getPointageStatistics(this.currentDate);
  }

  getPointageStatistics(date: string) {
    this.pointageService.getPointageStatistics(date).subscribe((data) => {
      console.log('Données reçues de l\'API:', data); // Affichez les données dans la console
      this.updateCardValue('Total Employees', data['total_employes']);
      this.updateCardValue('A l\'heure', data['present']);
      this.updateCardValue('Absent', data['absent']);
      this.updateCardValue('Arrivée tardive', data['retard']);
      this.updateCardValue('Départs anticipés', data['depart_anticipé']);
      this.updateCardValue('Départs Tardives', data['depart_tardif']);
    });
  }
  updateCardValue(cardTitle: string, value: number) {
    const card = this.cards.find((c) => c.title === cardTitle);
    if (card) {
      card.value = value;
    }
  }
  
}
