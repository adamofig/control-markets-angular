import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
// import { GENERICS_ROUTES } from './generic.routes';

@Component({
  selector: 'app-video-projects-gen',
  imports: [RouterModule],
  templateUrl: './videoGenerators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoProjectsGenComponent {
  // public static routes = GENERICS_ROUTES;
}
