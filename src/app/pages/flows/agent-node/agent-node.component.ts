import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, DynamicNode, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { AgentDetailsComponent } from './agent-details/agent-details';
import { FlowDiagramStateService } from '../flow-diagram-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ButtonModule } from 'primeng/button';
import { FlowExecutionStateService } from '../flow-execution-state.service';

export interface CustomAgentNode extends ComponentDynamicNode {
  agentCard: IAgentCard;
}

@Component({
  selector: 'app-agent-node',
  imports: [Vflow, ButtonModule],
  templateUrl: './agent-node.component.html',
  styleUrl: './agent-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNodeComponent extends CustomNodeComponent<CustomAgentNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);

  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.data()?.agentCard.assets?.image?.url);
    });
    // Creo que necesito entrar al job
    computed(() => {
      return this.flowExecutionStateService.getFlowExecutionState()?.tasks[this.node().id];
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

  removeNode(): void {
    this.flowDiagramStateService.removeNode(this.node().id);
  }
}
