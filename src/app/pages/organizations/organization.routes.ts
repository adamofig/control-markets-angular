import { Routes } from '@angular/router';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { OrganizationDetailComponent } from './organization-detail/organization-detail.component';
import { OrganizationFormComponent } from './organization-form/organization-form.component';

export const ORGANIZATIONS_ROUTES: Routes = [
  {
    path: '',
    component: OrganizationsComponent,
    children: [
      {
        path: '',
        component: OrganizationListComponent,
      },
      {
        path: 'details/:id',
        component: OrganizationDetailComponent,
      },
      {
        path: 'edit',
        component: OrganizationFormComponent,
      },
      {
        path: 'edit/:id',
        component: OrganizationFormComponent,
      },
    ],
  },
];
