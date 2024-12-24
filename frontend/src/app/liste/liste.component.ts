import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartementService } from '../departement.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UtilisateurService } from '../utilisateur.service';
import { CohorteService } from '../cohorte.service';
import { Router, ActivatedRoute } from '@angular/router';

interface User {
  id: string;
  photo: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  matricule: string;
  address: string;
  selected?: boolean; // Ajout de la propriété selected pour gérer la sélection
}

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NavbarComponent, SidebarComponent],
  providers: [UtilisateurService, DepartementService, CohorteService]
})
export class ListeComponent implements OnInit {
  departmentId: string | null = null; // Initialisation avec null
  departmentUsers: User[] = [];
  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 5;
  selectAll: boolean = false;
  selectedUsersCount: number = 0;

  constructor(private utilisateurService: UtilisateurService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.departmentId = params.get('id');
      if (this.departmentId) {
        this.loadDepartmentUsers();
      }
    });
  }

  loadDepartmentUsers() {
    if (this.departmentId) {
      this.utilisateurService.getUtilisateursByDepartmentAndFunction(this.departmentId, 'apprenant').subscribe({
        next: (data) => {
          this.departmentUsers = data;
          this.users = this.departmentUsers;
          this.updatePagination();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des employés :', err);
        }
      });
    }
  }

  // Met à jour la pagination après un filtrage ou un changement de page
  updatePagination() {
    // Mettre à jour le nombre total de pages
    this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
    // Mettre à jour les utilisateurs filtrés en fonction de la page actuelle
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredUsers = this.users.slice(start, end);
  }

  // Méthode de filtrage des utilisateurs
  filterUsers(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    // Filtrer les utilisateurs par prénom ou nom
    const filtered = this.users.filter(user =>
      user.firstName.toLowerCase().includes(query.toLowerCase()) ||
      user.lastName.toLowerCase().includes(query.toLowerCase())
    );
    this.users = filtered; // Mettre à jour les utilisateurs avec le filtre
    this.currentPage = 1; // Réinitialiser la page à 1 après un filtre
    this.updatePagination(); // Recalcule la pagination
  }

  // Méthodes de navigation entre les pages
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.filteredUsers = this.users.slice(start, end);
  }

  editUser(user: User) {
    // Logique pour éditer un utilisateur
  }

  // Ajout d'un utilisateur
  addUser() {
    this.router.navigate(['/inscription']);
  }

  // Suppression d'un utilisateur
  deleteUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.firstName} ${user.lastName} ?`)) {
      this.utilisateurService.deleteUtilisateur(user.id).subscribe(
        () => {
          this.users = this.users.filter(u => u.id !== user.id);
          this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
          alert('Utilisateur supprimé avec succès.');
        },
        (error) => {
          console.error('Erreur lors de la suppression de l\'utilisateur :', error);
          alert('Une erreur est survenue lors de la suppression.');
        }
      );
    }
  }

  // Blocage d'un utilisateur
  blockUser(user: User) {
    if (confirm(`Êtes-vous sûr de vouloir bloquer ${user.firstName} ${user.lastName} ?`)) {
      this.utilisateurService.blockUtilisateur(user.id).subscribe(
        () => {
          user.status = 'Bloqué';
          alert('Utilisateur bloqué avec succès.');
        },
        (error) => {
          console.error('Erreur lors du blocage de l\'utilisateur :', error);
          alert('Une erreur est survenue lors du blocage.');
        }
      );
    }
  }

  // Suppression des utilisateurs sélectionnés
  deleteSelectedUsers() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      alert('Aucun utilisateur sélectionné.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir supprimer les utilisateurs sélectionnés ?')) {
      selectedUsers.forEach(user => {
        this.utilisateurService.deleteUtilisateur(user.id).subscribe(
          () => {
            this.users = this.users.filter(u => u.id !== user.id);
            this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);
          },
          (error) => {
            console.error('Erreur lors de la suppression des utilisateurs :', error);
            alert('Une erreur est survenue lors de la suppression.');
          }
        );
      });
      alert('Utilisateurs supprimés avec succès.');
    }
  }

  // Blocage des utilisateurs sélectionnés
  blockSelectedUsers() {
    const selectedUsers = this.filteredUsers.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      alert('Aucun utilisateur sélectionné.');
      return;
    }
    if (confirm('Êtes-vous sûr de vouloir bloquer les utilisateurs sélectionnés ?')) {
      selectedUsers.forEach(user => {
        this.utilisateurService.blockUtilisateur(user.id).subscribe(
          () => {
            user.status = 'Bloqué';
          },
          (error) => {
            console.error('Erreur lors du blocage des utilisateurs :', error);
            alert('Une erreur est survenue lors du blocage.');
          }
        );
      });
      alert('Utilisateurs bloqués avec succès.');
    }
  }

  // Sélectionner/désélectionner tous les utilisateurs
  toggleSelectAll() {
    this.filteredUsers.forEach(user => user.selected = this.selectAll);
    this.updateSelectedUsersCount();
  }

  // Mettre à jour le nombre d'utilisateurs sélectionnés
  toggleSelect(user: User) {
    this.selectAll = this.filteredUsers.every(user => user.selected);
    this.updateSelectedUsersCount();
  }

  updateSelectedUsersCount() {
    this.selectedUsersCount = this.filteredUsers.filter(user => user.selected).length;
  }

  // Exporter les utilisateurs en CSV
  exportCSV() {
    // Logique pour exporter les utilisateurs en CSV
  }
}
