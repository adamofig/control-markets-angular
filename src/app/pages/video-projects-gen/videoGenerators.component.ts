import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videoGenerators',
  imports: [RouterModule],
  templateUrl: './videoGenerators.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoGeneratorsComponent {}
