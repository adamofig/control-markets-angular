import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, DynamicNode, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { AgentDetailsComponent } from './agent-details/agent-details';
import { FlowDiagramStateService } from '../flow-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';

export interface CustomAgentNode extends ComponentDynamicNode {
  agentCard: IAgentCard;
}

@Component({
  selector: 'app-agent-node',
  imports: [Vflow],
  templateUrl: './agent-node.component.html',
  styleUrl: './agent-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNodeComponent extends CustomNodeComponent<CustomAgentNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowDiagramStateService = inject(FlowDiagramStateService);

  // Existe node() que es todo el nodo con todo su data y data() que es solo la data.

  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.data()?.agentCard.assets?.image?.url);
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    // console.log('agent-node', this.flowDiagramStateService.edges());
    // const edge = this.flowDiagramStateService.edges().find(edge => edge.target === this.node().id);
    // if (edge) {
    //   this.taskAssignedId = edge.source;
    // }
  }

  openModal(): void {
    this.dialogService.open(AgentDetailsComponent, {
      header: 'Agent Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
      data: {
        node: this.node(),
      },
    });
  }
}
