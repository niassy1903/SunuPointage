import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CohorteService } from '../cohorte.service';
import { HttpClientModule } from '@angular/common/http';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-cohorte',
  templateUrl: './edit-cohorte.component.html',
  styleUrls: ['./edit-cohorte.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [CohorteService]
})
export class EditCohorteComponent implements OnInit {
  cohorte: any = {};

  constructor(
    public router: Router,
    private cohorteService: CohorteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getCohorteById(id);
    }
  }

  getCohorteById(id: string): void {
    this.cohorteService.getCohorteById(id).subscribe(
      (data) => {
        this.cohorte = data;
        if (this.cohorte && this.cohorte.annee_creation) {
          // Convertir la date en format jj/mm/aaaa
          const date = new Date(this.cohorte.annee_creation);
          this.cohorte.annee_creation = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la cohorte', error);
      }
    );
  }

  updateCohorte(): void {
    // Convertir la date en format yyyy-MM-dd avant d'envoyer la requête
    if (this.cohorte.annee_creation) {
      const [day, month, year] = this.cohorte.annee_creation.split('/');
      this.cohorte.annee_creation = `${year}-${month}-${day}`;
    }

    this.cohorteService.updateCohorte(this.cohorte.id, this.cohorte).subscribe(
      (data) => {
        // Afficher le modal de succès
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // Rediriger après 5 secondes
        setTimeout(() => {
          successModal.hide();
          this.navigateToCohorteList();
        }, 5000);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la cohorte', error);
        // Afficher le modal d'erreur
        const errorModal = new bootstrap.Modal(document.getElementById('errorModal'));
        errorModal.show();
      }
    );
  }

  navigateToCohorteList(): void {
    this.router.navigate(['/cohorte']);
  }
}
