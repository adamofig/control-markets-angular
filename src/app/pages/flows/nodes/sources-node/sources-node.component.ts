import { Component, Input } from '@angular/core';
import { SlicePipe, CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-sources-node',
  imports: [TagModule, SlicePipe, CommonModule],
  templateUrl: './sources-node.component.html',
  styleUrl: './sources-node.component.scss',
  standalone: true,
})
export class SourcesNodeComponent {
  @Input() thumbnail: { url: string } | null = null;
  @Input() content: string = '';
  @Input() tag: string = '';
}
