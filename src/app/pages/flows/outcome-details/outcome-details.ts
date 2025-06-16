import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';

@Component({
  selector: 'app-outcome-details',
  imports: [Vflow, DialogModule],
  templateUrl: './outcome-details.html',
  styleUrl: './outcome-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeDetailsComponent {}
