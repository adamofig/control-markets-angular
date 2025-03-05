import { ChangeDetectionStrategy, Component } from '@angular/core';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videoGenerators',
  imports: [RouterModule],
  templateUrl: './videoGenerators.component.html',
  styleUrl: './videoGenerators.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoGeneratorsComponent {}
