import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { DepartementService } from '../departement.service';
import { CohorteService } from '../cohorte.service';
import { UtilisateurService } from '../utilisateur.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SidebarComponent, NavbarComponent, HttpClientModule, FormsModule, RouterModule],
  providers: [UtilisateurService, DepartementService, CohorteService]
})
export class InscriptionComponent implements OnInit {
  inscriptionForm: FormGroup;
  fonction: string = '';
  showNextStep: boolean = false;
  departements: any[] = [];
  cohortes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private departementService: DepartementService,
    private cohorteService: CohorteService,
    private utilisateurService: UtilisateurService,
    private router: Router
  ) {
    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', Validators.required],
      fonction: ['', Validators.required],
      photo: [''],
      departement: [''],
      cohorte: [''],
      password: [''],
      confirmPassword: [''],
     
    });
  }

  ngOnInit() {
    this.departementService.getDepartements().subscribe(data => {
      this.departements = data;
    });

    this.cohorteService.getCohortes().subscribe(data => {
      this.cohortes = data;
    });

    const fonctionControl = this.inscriptionForm.get('fonction');
    if (fonctionControl) {
      this.fonction = fonctionControl.value;
    }
  }

  onFonctionChange() {
    const fonctionControl = this.inscriptionForm.get('fonction');
    if (fonctionControl) {
      this.fonction = fonctionControl.value;
    }
  }

  nextStep() {
    this.showNextStep = true;
  }

  onSubmit() {
    if (this.inscriptionForm.valid) {
      this.utilisateurService.createUtilisateur(this.inscriptionForm.value).subscribe(
        response => {
          console.log('Utilisateur créé avec succès', response);
          // Redirection vers la page des utilisateurs
          this.router.navigate(['/utilisateur']);  // Remplacez '/utilisateurs' par le chemin correct vers la page des utilisateurs
        },
        error => {
          console.error('Erreur lors de la création de l\'utilisateur', error);
        }
      );
    }
  }
  
}