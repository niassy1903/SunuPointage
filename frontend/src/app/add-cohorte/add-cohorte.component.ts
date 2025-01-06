import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CohorteService } from '../cohorte.service'; // Assurez-vous que le chemin est correct
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-cohorte',
  templateUrl: './add-cohorte.component.html',
  styleUrls: ['./add-cohorte.component.css'],
  imports: [FormsModule, HttpClientModule, CommonModule],
  providers: [CohorteService],
})
export class AddCohorteComponent {
  cohorte = { nom: '', annee_creation: '', description: '' };
  showSuccessModal = false;

  constructor(public router: Router, private cohorteService: CohorteService) {}

  addCohorte() {
    this.cohorteService.createCohorte(this.cohorte).subscribe(
      (response) => {
        console.log('Cohorte ajoutée avec succès', response);
        this.showSuccessModal = true;
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la cohorte', error);
        alert('Une erreur est survenue lors de l\'ajout de la cohorte');
      }
    );
  }
}
