import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-node-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-node.html',
  styleUrl: './empty-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// COPY THIS NODE TO CREATE NEW NODES
export class EmptyNodeComponent {
  @Input() name: string = '';
  @Input() description: string = '';
}
