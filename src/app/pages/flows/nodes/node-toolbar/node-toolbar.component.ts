import { Component, EventEmitter, Output, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-node-toolbar',
  templateUrl: './node-toolbar.component.html',
  styleUrls: ['./node-toolbar.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule],
})
export class BaseNodeToolbarComponent {
  @Input() hasExecutionState = false;
  @Output() delete = new EventEmitter<void>();
  @Output() none = new EventEmitter<void>();
  @Output() details = new EventEmitter<void>();
  @Output() duplicate = new EventEmitter<void>();
  @Output() executionDetails = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }

  onNone() {
    this.none.emit();
  }

  onDetails() {
    this.details.emit();
  }

  onDuplicate() {
    this.duplicate.emit();
  }

  onExecutionDetails() {
    this.executionDetails.emit();
  }
}
