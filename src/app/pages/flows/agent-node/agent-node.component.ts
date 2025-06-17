import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { AgentDetailsComponent } from './agent-details/agent-details';

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
  public dialogService = inject(DialogService);

  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.data()?.text);
    });
  }

  openModal(): void {
    this.dialogService.open(AgentDetailsComponent, {
      header: 'Agent Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
      data: this.data(),
    });
  }
}
