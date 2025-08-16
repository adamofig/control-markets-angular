import { Routes } from '@angular/router';

export const VIDEO_ANALIZER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./video-analizer').then(m => m.VideoAnalizerComponent),
  },
  {
    path: 'tiktoks',
    loadComponent: () => import('./tiktoks/tiktok-list').then(m => m.TiktokListComponent),
  },
  {
    path: 'tiktoks/:id',
    loadComponent: () => import('./tiktoks-user/tiktoks-user').then(m => m.TiktoksUserComponent),
  },
  {
    path: 'tiktoks/:user/analysis/:id',
    loadComponent: () => import('./tiktok-analysis/tiktok-analysis').then(m => m.TiktokAnalysisComponent),
  },
];
