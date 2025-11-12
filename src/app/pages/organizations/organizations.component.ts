import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ORGANIZATIONS_ROUTES } from './organization.routes';

@Component({
  selector: 'app-organizations',
  imports: [RouterModule],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationsComponent {
  public static routes = ORGANIZATIONS_ROUTES;
}
