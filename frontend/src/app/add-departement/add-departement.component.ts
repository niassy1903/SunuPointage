import { Component } from '@angular/core';
import { DepartementService } from '../departement.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Importez Bootstrap globalement
declare var bootstrap: any;

@Component({
  selector: 'app-add-departement',
  templateUrl: './add-departement.component.html',
  styleUrls: ['./add-departement.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule,CommonModule],
  providers: [DepartementService],
})
export class AddDepartementComponent {
  departement = {
    nom: '',
    annee_creation: '',
    description: '',
  };

  existingDepartements: string[] = []; // Liste des départements existants
  errorMessage = ''; // Message d'erreur pour la validation en temps réel

  constructor(private departementService: DepartementService) {
    // Charger les noms des départements existants au démarrage
    this.departementService.getDepartements().subscribe((data: any[]) => {
      this.existingDepartements = data.map((dept) => dept.nom.toLowerCase());
    });
  }

  onNomChange() {
    if (this.existingDepartements.includes(this.departement.nom.toLowerCase())) {
      this.errorMessage = 'Le nom du département existe déjà.';
    } else {
      this.errorMessage = '';
    }
  }

  onSubmit() {
    if (this.errorMessage) {
      alert('Corrigez les erreurs avant de soumettre le formulaire.');
      return;
    }

    this.departementService.addDepartement(this.departement).subscribe({
      next: (response) => {
        console.log('Département ajouté :', response);
        this.showSuccessModal();
        this.departement = { nom: '', annee_creation: '', description: '' };
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du département :', error);
        alert('Une erreur est survenue lors de l\'ajout du département.');
      },
    });
  }

  showSuccessModal() {
    const successModal = new bootstrap.Modal(
      document.getElementById('successModal')!
    );
    successModal.show();
  }
}
