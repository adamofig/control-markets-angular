import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, DynamicNode, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { AgentDetailsComponent } from './agent-details/agent-details';
import { DynamicNodeWithData } from '../../services/flow-diagram-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ButtonModule } from 'primeng/button';
import { FlowExecutionStateService } from '../../services/flow-execution-state.service';
import { StatusJob } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FlowExecutionUtilsService } from '../../services/flow-execution-utils';
import { BaseFlowNode } from '../base-flow-node';

export interface CustomAgentNode extends ComponentDynamicNode {
  agentCard: IAgentCard;
}

@Component({
  selector: 'app-agent-node',
  imports: [Vflow, ButtonModule, TagModule, ProgressSpinnerModule],
  templateUrl: './agent-node.component.html',
  styleUrl: './agent-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNodeComponent extends BaseFlowNode<CustomAgentNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public flowExecutionUtilsService = inject(FlowExecutionUtilsService);
  public agentCard = computed(() => this.node()?.data?.agentCard);

  public statusJob = StatusJob;

  // Entender como obtener el agent card.y monitorear el state.
  public agentExecutionState = computed(() => {
    return this.flowExecutionUtilsService.getAgentExecutionState(this.node() as unknown as DynamicNodeWithData);
  });

  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.data()?.agentCard.assets?.image?.url);
    });
    // Creo que necesito entrar al job
    computed(() => {
      return this.flowExecutionStateService.getFlowExecutionState()?.tasks.find(t => t.nodeId === this.node().id);
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
}
