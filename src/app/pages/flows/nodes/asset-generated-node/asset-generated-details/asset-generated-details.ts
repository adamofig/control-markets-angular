import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-outcome-details',
  imports: [Vflow, DialogModule, JsonPipe, CommonModule],
  templateUrl: './asset-generated-details.html',
  styleUrl: './asset-generated-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetGeneratedDetailsComponent {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public node = signal<any>(this.dynamicDialogConfig.data);
  
  public nodeData = computed(() => this.node()?.data?.nodeData);

  constructor() {}
}

