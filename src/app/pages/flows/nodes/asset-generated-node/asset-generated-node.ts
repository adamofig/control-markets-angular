import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asset-generated-node',
  imports: [CommonModule],
  templateUrl: './asset-generated-node.html',
  styleUrl: './asset-generated-node.scss',
  standalone: true,
})
export class AssetGeneratedNodeComponent {
  @Input() result: any = null;

  public gifUrl = computed(() => this.result?.gif?.url);
  public videoUrl = computed(() => this.result?.url);
}
