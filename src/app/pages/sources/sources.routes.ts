import { Routes } from '@angular/router';

export const SOURCES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./source-list/source-list.component').then(m => m.SourceListComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./source-form/source-form.component').then(m => m.SourceFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./source-form/source-form.component').then(m => m.SourceFormComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./source-detail/source-detail.component').then(m => m.SourceDetailComponent),
  },
];
