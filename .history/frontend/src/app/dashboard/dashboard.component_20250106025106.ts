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
  styleUrl: './dashboard.component.css',
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
    // Appel des méthodes pour récupérer les pointages
    this.getPointages(this.currentDate);  // Utiliser la date courante
  }

  getPointages(date: string) {
    this.pointageService.getTotalPointages(date).subscribe((data) => {
      this.totalPointages = data.total;  // Remplace par la structure correcte du retour
      this.updateCardValue('Total Pointages', this.totalPointages);
    });

    this.pointageService.getTotalValidations(date).subscribe((data) => {
      this.totalValidations = data.total;  // Remplace par la structure correcte du retour
      this.updateCardValue('Validations', this.totalValidations);
    });

    this.pointageService.getTotalRejets(date).subscribe((data) => {
      this.totalRejets = data.total;  // Remplace par la structure correcte du retour
      this.updateCardValue('Rejets', this.totalRejets);
    });
  }

  updateCardValue(cardTitle: string, value: number) {
    const card = this.cards.find(c => c.title === cardTitle);
    if (card) {
      card.value = value;
    }
  }
}

