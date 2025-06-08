import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-distribution-chanel-node',
  imports: [Vflow],
  templateUrl: './distribution-chanel-node.component.html',
  styleUrl: './distribution-chanel-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionChanelNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  constructor() {
    super();
    effect(() => {
      console.log('distribution-chanel-node', this.data()?.text);
    });
  }
}
