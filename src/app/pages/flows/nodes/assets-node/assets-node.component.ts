import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [TagModule, CommonModule],
})
export class AssetsNodeComponent {
  @Input() name: string = '';
  @Input() status: string = '';
  @Input() storage: { url: string } = { url: '' };
}
