import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-distribution-chanel-details',
  imports: [ButtonModule],
  templateUrl: './agent-details.html',
  styleUrl: './agent-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentDetailsComponent {
  constructor() {}

  public startFlow(): void {}
}
