import { Component } from '@angular/core';
import { ChartsComponent } from '../component/charts/charts/charts.component';

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
  imports: [ChartsComponent], // Importation du composant standalone
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  currentTime = '8:02:09 AM';
  currentDate = '2 août 2023';
  
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
