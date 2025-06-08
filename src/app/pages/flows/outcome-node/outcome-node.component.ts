import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow],
  templateUrl: './outcome-node.component.html',
  styleUrl: './outcome-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutcomeNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  constructor() {
    super();
    effect(() => {
      console.log('outcome-node', this.data()?.text);
    });
  }
}
