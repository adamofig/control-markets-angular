import { Component, EventEmitter, Output, computed, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ITaskExecutionState, StatusJob } from 'src/app/pages/flows/models/flows.model';
import { CounterComponent } from 'src/app/components/counter/counter.component';

@Component({
  selector: 'app-actions-toolbar',
  templateUrl: './actions-toolbar.component.html',
  styleUrls: ['./actions-toolbar.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, CounterComponent],
})
export class ActionsToolbarComponent {
  @Output() runNode = new EventEmitter<void>();
  @Output() getExecutionUrl = new EventEmitter<void>();
  @Output() runEndPoint = new EventEmitter<void>();

  statusJob = input<StatusJob>(StatusJob.PENDING);
  taskExecutionState = input<ITaskExecutionState | null>(null);

  isJobInProgress = computed(() => this.statusJob() === StatusJob.IN_PROGRESS);

  onRunNode() {
    // debugger;
    const audio = new Audio('assets/audios/notifications/short-whistle.wav');
    audio.play();
    this.runNode.emit();
  }

  onGetExecutionUrl() {
    this.getExecutionUrl.emit();
  }

  onRunEndPoint() {
    this.runEndPoint.emit();
  }
}
