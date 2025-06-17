import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-distribution-chanel-details',
  imports: [ButtonModule, JsonPipe],
  templateUrl: './distribution-chanel-details.html',
  styleUrl: './distribution-chanel-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionChanelDetailsComponent {
  constructor() {}
  public dynamicDialogConfig = inject(DynamicDialogConfig);

  public startFlow(): void {}
}
