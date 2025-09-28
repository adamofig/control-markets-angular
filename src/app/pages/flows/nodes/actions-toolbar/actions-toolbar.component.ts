import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actions-toolbar',
  templateUrl: './actions-toolbar.component.html',
  styleUrls: ['./actions-toolbar.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule],
})
export class ActionsToolbarComponent {
  @Output() runNode = new EventEmitter<void>();
  @Output() runEndPoint = new EventEmitter<void>();

  onRunNode() {
    this.runNode.emit();
  }

  onRunEndPoint() {
    this.runEndPoint.emit();
  }
}
