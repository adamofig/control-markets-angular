import { Routes } from '@angular/router';
import { LeadsComponent } from './leads.component';
import { LeadListComponent } from './lead-list/lead-list.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';
import { LeadFormComponent } from './lead-form/lead-form.component';

export const GENERICS_ROUTES: Routes = [
  {
    path: '',
    component: LeadsComponent,
    children: [
      {
        path: '',
        component: LeadListComponent,
      },
      {
        path: 'details/:id',
        component: LeadDetailComponent,
      },
      {
        path: 'edit',
        component: LeadFormComponent,
      },
      {
        path: 'edit/:id',
        component: LeadFormComponent,
      },
    ],
  },
];
