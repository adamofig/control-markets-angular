import { Routes } from '@angular/router';

export const FLOWS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./flow-list/flow-list').then(m => m.FlowListComponent),
  },
  {
    path: 'edit',
    loadComponent: () => import('./flow-workspace/flow-canva').then(m => m.FlowsComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./flow-workspace/flow-canva').then(m => m.FlowsComponent),
  },
  {
    path: 'edit/:id/:executionId',
    loadComponent: () => import('./flow-workspace/flow-canva').then(m => m.FlowsComponent),
  },
];
