import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./task-list/task-list.component').then(m => m.TaskListComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./task-form/task-form.component').then(m => m.TaskFormComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./task-details/task-details.component').then(m => m.TaskDetailsComponent),
  },
];
