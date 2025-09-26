import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Vflow, CustomNodeComponent } from 'ngx-vflow';

// --- Description of red square component node
export interface RedSquareData {
  redSquareText: string;
}

@Component({
  templateUrl: './test-node.html',
  styleUrls: ['./test-node.css'],
  standalone: true,
  imports: [Vflow],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedSquareNodeComponent extends CustomNodeComponent<RedSquareData> {
  @Output()
  readonly redSquareEvent = new EventEmitter<string>();

  onClick() {
    this.redSquareEvent.emit('Click from red square');
  }
}
