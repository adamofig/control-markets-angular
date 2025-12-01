import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { redirectToIfAuth } from '@dataclouder/ngx-auth';

import { RouteNames } from './core/enums';
import { authAndUserGuard } from '@dataclouder/ngx-users';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
        canActivate: [redirectToIfAuth('page/home')],
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
      },
      {
        path: 'terms',
        loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent),
      },
      {
        path: 'intro',
        loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage),
      },
    ],
  },

  {
    path: 'auth',
    loadComponent: () => import('./auth/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: RouteNames.Signin,
        pathMatch: 'full',
      },
      {
        path: RouteNames.Signin,
        loadComponent: () => import('./login/login.page').then(m => m.LoginComponent),
        canActivate: [redirectToIfAuth('page/home')],
      },
      {
        path: RouteNames.Signup,
        loadComponent: () => import('./login/signup.component').then(m => m.AppSignupComponent),
        canActivate: [redirectToIfAuth('page/home')],
      },
    ],
  },
  {
    path: 'page',
    canActivate: [authAndUserGuard],

    loadComponent: () => import('./ionic-layout/ionic-layout.component').then(m => m.IonicLayoutComponent),
    children: [
      {
        path: 'flows',
        loadChildren: () => import('./pages/flows/flows.routes').then(m => m.FLOWS_ROUTES),
      },

      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },

      {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent),
          },
          {
            path: 'users',
            loadComponent: () => import('@dataclouder/ngx-users').then(m => m.AdminUserComponent),
          },

          {
            path: 'agent-rules',
            loadChildren: () => import('@dataclouder/ngx-agent-cards').then(m => m.ConversationRulesComponent.routes),
          },
        ],
      },
      {
        path: 'tasks',
        loadChildren: () => import('./pages/tasks/tasks.routes').then(m => m.TASKS_ROUTES),
      },
      {
        path: 'leads',
        loadChildren: () => import('./pages/lead/lead.routes').then(m => m.GENERICS_ROUTES),
      },
      {
        path: 'lessons',
        loadComponent: () => import('./pages/lessons/explore.page').then(m => m.ExplorePage),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/lessons/lesson-list/lesson-list.component').then(m => m.LessonListComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/lessons/lesson-details/lesson-details.component').then(m => m.LessonDetailsComponent),
          },
          {
            path: 'list',
            loadComponent: () => import('./pages/lessons/lesson-list/lesson-list.component').then(m => m.LessonListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/lessons/explore-edit/explore-edit.component').then(m => m.ExploreEditComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/lessons/explore-edit/explore-edit.component').then(m => m.ExploreEditComponent),
          },
        ],
      },
      {
        path: 'sources',
        loadChildren: () => import('./pages/sources/sources.routes').then(m => m.SOURCES_ROUTES),
      },

      {
        path: 'jobs',
        loadChildren: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent.routes),
      },
      {
        path: 'video-analizer',
        loadChildren: () => import('./pages/video-analizer/video-analizer.routes').then(m => m.VIDEO_ANALIZER_ROUTES),
      },

      {
        path: 'admin/organizations',
        loadChildren: () => import('./pages/organizations/organizations.component').then(m => m.OrganizationsComponent.routes),
      },
      {
        path: 'video-generator',
        loadComponent: () => import('./pages/video-projects-gen/videoGenerators.component').then(m => m.VideoProjectsGenComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/video-projects-gen/video-project-list/videoGenerator-list.component').then(m => m.VideoGeneratorListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/video-projects-gen/video-projects-form/video-project-form').then(m => m.VideoProjectFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/video-projects-gen/video-projects-form/video-project-form').then(m => m.VideoProjectFormComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () =>
              import('./pages/video-projects-gen/video-projects-detail/video-project-detail.component').then(m => m.VideoGeneratorDetailComponent),
          },
        ],
      },
      {
        path: 'tools',
        loadComponent: () => import('./pages/tools/tools').then(m => m.ToolsComponent),
      },

      {
        path: 'test',
        loadComponent: () => import('./pages/test/test.component').then(m => m.TestComponent),
      },
      {
        path: 'ai-playground',
        loadComponent: () => import('./pages/ai-playground/ai-playground.component').then(m => m.AiPlaygroundComponent),
      },
      {
        path: 'agents',
        loadComponent: () => import('./pages/agent-cards/agent-card-router').then(m => m.AgentCardRouterComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/agent-cards/agent-card-list/agent-card-list').then(m => m.AgentCardListPage),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/agent-cards/agent-card-details/agent-card-details').then(m => m.AgentCardDetailsPage),
          },
        ],
      },
    ],
  },

  {
    path: 'page/stack',

    loadComponent: () => import('./ionic-layout/stack-ionic/stack-ionic.component').then(m => m.StackIonicComponent),
    children: [
      {
        path: 'conversation-form',
        loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
      },
      {
        path: 'conversation-form/:id',
        loadComponent: () => import('./pages/agent-cards/agent-card-form/agent-card-form').then(m => m.AgentCardFormPage),
      },

      {
        path: 'chat',
        loadComponent: () => import('./pages/agent-cards/agent-card-chat/agent-card-chat').then(m => m.AgentCardChatComponent),
      },
      {
        path: 'chat/:id',
        loadComponent: () => import('./pages/agent-cards/agent-card-chat/agent-card-chat').then(m => m.AgentCardChatComponent),
      },

      {
        path: 'conversation-details',
        loadComponent: () => import('./pages/agent-cards/agent-card-details/agent-card-details').then(m => m.AgentCardDetailsPage),
      },

      {
        path: 'conversation-details/:id',
        loadComponent: () => import('./pages/agent-cards/agent-card-details/agent-card-details').then(m => m.AgentCardDetailsPage),
      },

      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
      },
    ],
  },

  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
