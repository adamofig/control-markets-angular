import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DistributionChanelDetailsComponent } from './distribution-chanel-details/distribution-chanel-details';
import { BaseFlowNode } from '../base-flow-node';
import { INodeConfig } from '../../models/flows.model';

export type NodeDistributionChanelData = {
  data?: any;
  config: INodeConfig;
  nodeData: {
    text: string;
    image: string;
  }
};

@Component({
  selector: 'app-distribution-chanel-node',
  imports: [Vflow, DialogModule],
  templateUrl: './distribution-chanel-node.component.html',
  styleUrl: './distribution-chanel-node.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionChanelNodeComponent extends BaseFlowNode<NodeDistributionChanelData> implements OnInit {
  public dialogService = inject(DialogService);

  constructor() {
    super();
    effect(() => {
      console.log('distribution-chanel-node', this.nodeData()?.text);
    });
  }

  openModal(): void {
    this.dialogService.open(DistributionChanelDetailsComponent, {
      header: 'Distribution Chanel Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
    });
  }
}
