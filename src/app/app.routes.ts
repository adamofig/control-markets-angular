import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { redirectToIfAuth } from '@dataclouder/app-auth';

import { RouteNames } from './core/enums';

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
    children: [
      {
        path: '',
        redirectTo: RouteNames.Signup,
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
    path: 'page/stack',
    canActivate: [AuthGuardService],

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
    path: 'page',
    canActivate: [AuthGuardService],
    loadComponent: () => import('./ionic-layout/ionic-layout.component').then(m => m.IonicLayoutComponent),
    children: [
      {
        path: 'flows',
        loadComponent: () => import('./pages/flows/flow-outlet').then(m => m.FlowOutletComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/flows/flow-list/flow-list').then(m => m.FlowListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/flows/flow-workspace/flows-workspace').then(m => m.FlowsComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/flows/flow-workspace/flows-workspace').then(m => m.FlowsComponent),
          },
        ],
      },

      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },

      {
        path: 'tasks',
        loadComponent: () => import('./pages/tasks/tasks.page').then(m => m.TasksPage),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/tasks/task-list/task-list.component').then(m => m.TaskListComponent),
          },
          {
            path: 'jobs',
            loadComponent: () => import('./pages/tasks/jobs/job-list.component').then(m => m.JobListComponent),
          },
          {
            path: 'jobs/:id',
            loadComponent: () => import('./pages/tasks/jobs/job-list.component').then(m => m.JobListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/tasks/task-form/task-form.component').then(m => m.TaskFormComponent),
          },
        ],
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
        loadComponent: () => import('./pages/sources/sources.component').then(m => m.SourcesComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/sources/source-list/source-list.component').then(m => m.SourceListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/sources/source-form/source-form.component').then(m => m.SourceFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/sources/source-form/source-form.component').then(m => m.SourceFormComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/sources/source-detail/source-detail.component').then(m => m.SourceDetailComponent),
          },
        ],
      },

      {
        path: 'jobs',
        loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/jobs/job-list/job-list.component').then(m => m.JobListComponent),
          },
          {
            path: 'edit',
            loadComponent: () => import('./pages/jobs/job-form/job-form.component').then(m => m.JobFormComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./pages/jobs/job-form/job-form.component').then(m => m.JobFormComponent),
          },
          {
            path: 'details/:id',
            loadComponent: () => import('./pages/jobs/job-detail/job-detail.component').then(m => m.JobDetailComponent),
          },
        ],
      },
      {
        path: 'video-analizer',
        loadComponent: () => import('./pages/video-analizer/video-router').then(m => m.VideoRouterComponent),
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/video-analizer/video-analizer').then(m => m.VideoAnalizerComponent),
          },
          {
            path: 'tiktoks',
            loadComponent: () => import('./pages/video-analizer/tiktoks/tiktok-list').then(m => m.TiktokListComponent),
          },
          {
            path: 'tiktoks/:id',
            loadComponent: () => import('./pages/video-analizer/tiktoks-user/tiktoks-user').then(m => m.TiktoksUserComponent),
          },
          {
            path: 'tiktoks/:user/analysis/:id',
            loadComponent: () => import('./pages/video-analizer/tiktok-analysis/tiktok-analysis').then(m => m.TiktokAnalysisComponent),
          },
        ],
      },
      {
        path: 'video-generator',
        loadComponent: () => import('./pages/video-projects-gen/videoGenerators.component').then(m => m.VideoGeneratorsComponent),
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
        path: 'agents',
        loadComponent: () => import('./pages/agent-cards/agent-card-list/agent-card-list').then(m => m.AgentCardListPage),
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
