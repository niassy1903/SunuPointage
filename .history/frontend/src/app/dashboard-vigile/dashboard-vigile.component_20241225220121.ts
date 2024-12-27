import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
@Component({
  selector: 'app-dashboard-vigile',
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './dashboard-vigile.component.html',
  styleUrl: './dashboard-vigile.component.css'
})
export class DashboardVigileComponent {
  formData = {
    name: '',
    prenom: '',
    role: '',
    cardId: '',
  };

  onSubmit() {
    console.log('Form Submitted:', this.formData);
    alert('Formulaire validé !');
  }

  onReject() {
    console.log('Rejeté');
    alert('Formulaire rejeté.');
  }
}
