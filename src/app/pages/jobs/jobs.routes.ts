import { Routes } from '@angular/router';

export const JOBS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./job-list/job-list.component').then(m => m.JobListComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./job-form/job-form.component').then(m => m.JobFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./job-form/job-form.component').then(m => m.JobFormComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./job-detail/job-detail.component').then(m => m.OutcomeJobDetailComponent),
  },
];
