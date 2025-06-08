import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-agent-node',
  imports: [Vflow],
  templateUrl: './agent-node.component.html',
  styleUrl: './agent-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.data()?.text);
    });
  }
}
