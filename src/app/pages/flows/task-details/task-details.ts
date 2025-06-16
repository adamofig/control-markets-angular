import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';

@Component({
  selector: 'app-task-details',
  imports: [Vflow, DialogModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent {}
