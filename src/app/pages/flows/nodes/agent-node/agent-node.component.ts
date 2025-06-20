import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, DynamicNode, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { AgentDetailsComponent } from './agent-details/agent-details';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ButtonModule } from 'primeng/button';
import { FlowExecutionStateService } from '../../services/flow-execution-state.service';
import { IFlowExecutionState } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';

export interface CustomAgentNode extends ComponentDynamicNode {
  agentCard: IAgentCard;
}

@Component({
  selector: 'app-agent-node',
  imports: [Vflow, ButtonModule, TagModule],
  templateUrl: './agent-node.component.html',
  styleUrl: './agent-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNodeComponent extends CustomNodeComponent<CustomAgentNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public agentCard = computed(() => this.node()?.data?.agentCard);

  // Entender como obtener el agent card.y monitorear el state.
  public agentExecutionState = computed(() => {
    console.log('taskExecutionState', this.agentCard());
    const agentId: string = this.agentCard()?.id || this.agentCard()?._id || '';

    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      const taskId: string = agentId;

      const targetNodes = this.flowDiagramStateService.getTargetNodesForSource(this.node().id);
      console.log('targetNodes', targetNodes);

      if (targetNodes.length > 0) {
        const taskNodeId = targetNodes[0];
        const state = this.flowExecutionStateService.getFlowExecutionState();
        const targetTask = state?.tasks[taskNodeId];
        const job = targetTask?.jobs[this.node().id];

        return job;
      }

      const executionTask = executionState?.tasks[taskId];
      console.log('-------state', executionState);

      return executionTask;
    }
    return null;
  });

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
