import { RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { CohorteService } from './cohorte.service';
import { DepartementService } from './departement.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'edit/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const cohorteService = inject(CohorteService); // Injecter correctement le service
      try {
        const cohortes = await cohorteService.getCohortes().toPromise(); // Récupérer la liste des cohortes
        if (cohortes && Array.isArray(cohortes)) { // Vérification explicite
          return cohortes.map(cohorte => ({ id: cohorte.id })); // Retourne un tableau d'objets avec les ids
        }
        return []; // Retourne un tableau vide en cas de problème
      } catch (error) {
        console.error('Erreur lors de la récupération des cohortes:', error);
        return []; // Retourne un tableau vide en cas d'erreur
      }
    }
  },
  {
    path: 'edit-cohorte/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const cohorteService = inject(CohorteService); // Injecter correctement le service
      try {
        const cohortes = await cohorteService.getCohortes().toPromise();
        if (cohortes && Array.isArray(cohortes)) {
          return cohortes.map(cohorte => ({ id: cohorte.id }));
        }
        return [];
      } catch (error) {
        console.error('Erreur lors de la récupération des cohortes:', error);
        return [];
      }
    }
  },
  {
    path: 'departements/:departmentName/employees',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const departementService = inject(DepartementService); // Injecter correctement le service
      try {
        const departements = await departementService.getDepartements().toPromise();
        if (departements && Array.isArray(departements)) {
          return departements.map(departement => ({ departmentName: departement.name }));
        }
        return [];
      } catch (error) {
        console.error('Erreur lors de la récupération des départements:', error);
        return [];
      }
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
