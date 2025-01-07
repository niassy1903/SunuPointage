import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilisateurService } from '../utilisateur.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  providers: [UtilisateurService],
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  paginatedEmployees: any[] = [];
  departmentName: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private route: ActivatedRoute, private utilisateurService: UtilisateurService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.departmentName = params['departmentName'];
      this.loadEmployees(this.departmentName);
    });
  }

  loadEmployees(departmentName: string) {
    this.utilisateurService.getUtilisateursByDepartmentAndFunction(departmentName, 'employer').subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des employés :', err);
      }
    });
  }

  filterEmployees() {
    if (this.searchTerm.trim() === '') {
      this.filteredEmployees = this.employees;
    } else {
      this.filteredEmployees = this.employees.filter(employee =>
        employee.matricule.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.updatePagination();
  }
  

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
    this.changePage(this.currentPage);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }

  generatePageArray() {
    return Array(this.totalPages).fill(0).map((x, i) => i);
  }
}
