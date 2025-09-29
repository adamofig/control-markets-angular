import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() runEndPoint = new EventEmitter<void>();

  @Input() statusJob!: StatusJob;
  @Input() taskExecutionState: ITaskExecutionState | null = null;

  onRunNode() {
    this.runNode.emit();
  }

  onRunEndPoint() {
    this.runEndPoint.emit();
  }
}
