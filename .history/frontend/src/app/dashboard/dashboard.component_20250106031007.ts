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
  imports: [FormsModule, ChartsComponent, HttpClientModule, CommonModule], // Importation du composant standalone
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ PointageService],
})
export class DashboardComponent implements OnInit {

  constructor(
    private pointageService: PointageService // Injection du service PointageService
  ) {}

  currentTime = '8:02:09 AM';
  currentDate = '2 août 2023';
  
  // Déclaration des variables pour stocker les données des pointages
  totalPointages: number = 0;
  totalValidations: number = 0;
  totalRejets: number = 0;

  // Récupérer les cartes pour le dashboard
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

  ngOnInit() {
    // Appel de la méthode pour récupérer les statistiques des pointages par statut
    this.getPointageStatistics(this.currentDate);
  }
  getPointageStatistics(date: string) {
    // Assurez-vous que la date est au format 'YYYY-MM-DD'
    const formattedDate = this.convertToIsoFormat(date);
  
    this.pointageService.getPointageStatistics(formattedDate).subscribe((data) => {
      // Mise à jour des cartes avec les valeurs des statistiques
      this.updateCardValue('A l\'heure', data['validés']);
      this.updateCardValue('Absent', data['rejetés']);
      this.updateCardValue('Arrivée tardive', data['tardifs']);
      this.updateCardValue('Départs anticipés', data['anticipés']);
      this.updateCardValue('Départs Tardives', data['tardifs']);
    });
  }
  
  // Fonction pour convertir la date en format ISO 'YYYY-MM-DD'
  
  convertToIsoFormat(date: string): string {
    // Utiliser une bibliothèque comme `Intl.DateTimeFormat` pour formater les dates
    try {
      const dateObject = new Date(date);
  
      // Si la date est invalide
      if (isNaN(dateObject.getTime())) {
        throw new Error(`Invalid date format: ${date}`);
      }
  
      return dateObject.toISOString().split('T')[0]; // Format ISO : YYYY-MM-DD
    } catch (error) {
      console.error('Erreur lors de la conversion de la date :', error);
      throw new Error('Invalid date format. Assurez-vous que la date est au format supporté.');
    }
  }
  
  updateCardValue(cardTitle: string, value: number) {
    const card = this.cards.find(c => c.title === cardTitle);
    if (card) {
      card.value = value;
    }
  }
}
