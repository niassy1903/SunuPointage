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
    // Appel du service avec une date au format ISO
    this.pointageService.getPointageStatistics(date).subscribe((data) => {
      // Mise à jour des cartes avec les valeurs des statistiques
      this.updateCardValue('A l\'heure', data['validés']);
      this.updateCardValue('Absent', data['rejetés']);
      this.updateCardValue('Arrivée tardive', data['tardifs']);
      this.updateCardValue('Départs anticipés', data['anticipés']);
      this.updateCardValue('Départs Tardives', data['tardifs']);
    });
  }

  updateCardValue(cardTitle: string, value: number) {
    const card = this.cards.find((c) => c.title === cardTitle);
    if (card) {
      card.value = value;
    }
  }
}
