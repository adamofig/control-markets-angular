import { ChangeDetectionStrategy, Component, OnInit, effect } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-task-node',
  imports: [Vflow],
  templateUrl: './task-node.component.html',
  styleUrl: './task-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  constructor() {
    super();
    effect(() => {
      console.log('task-node', this.data()?.text);
    });
  }
}
