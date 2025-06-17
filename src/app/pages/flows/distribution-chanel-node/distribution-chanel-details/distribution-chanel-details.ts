import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-distribution-chanel-details',
  imports: [ButtonModule],
  templateUrl: './distribution-chanel-details.html',
  styleUrl: './distribution-chanel-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionChanelDetailsComponent {
  constructor() {}

  public startFlow(): void {}
}
