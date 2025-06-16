import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DistributionChanelDetailsComponent } from '../distribution-chanel-details/distribution-chanel-details';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-distribution-chanel-node',
  imports: [Vflow, DialogModule],
  templateUrl: './distribution-chanel-node.component.html',
  styleUrl: './distribution-chanel-node.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionChanelNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  public dialogService = inject(DialogService);

  constructor() {
    super();
    effect(() => {
      console.log('distribution-chanel-node', this.data()?.text);
    });
  }

  openModal(): void {
    this.dialogService.open(DistributionChanelDetailsComponent, {
      header: 'Distribution Chanel Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
    });
  }
}
