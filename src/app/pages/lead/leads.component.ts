import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GENERICS_ROUTES } from './lead.routes';

@Component({
  selector: 'app-leads',
  imports: [RouterModule],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsComponent {
  public static routes = GENERICS_ROUTES;
}
