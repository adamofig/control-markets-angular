import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JOBS_ROUTES } from './jobs.routes';

@Component({
  selector: 'app-jobs',
  imports: [RouterModule],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class JobsComponent {
  public static routes = JOBS_ROUTES;
}
