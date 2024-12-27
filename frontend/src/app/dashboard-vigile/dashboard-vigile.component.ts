import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard-vigile',
  standalone: true, // Standalone Component
  imports: [FormsModule, SidebarComponent, NavbarComponent], // Ajouter FormsModule ici
  templateUrl: './dashboard-vigile.component.html',
  styleUrls: ['./dashboard-vigile.component.css'],
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
