import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { AgentDetailsComponent } from './agent-details/agent-details';
import { DynamicNodeWithData } from '../../services/flow-diagram-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ButtonModule } from 'primeng/button';
import { StatusJob } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FlowExecutionUtilsService } from '../../services/flow-execution-utils';
import { BaseFlowNode } from '../base-flow-node';

export interface CustomAgentNode extends ComponentDynamicNode {
  nodeData: IAgentCard;
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
  public flowExecutionUtilsService = inject(FlowExecutionUtilsService);
  public agentCard = computed(() => this.node()?.data?.nodeData);

  public statusJob = StatusJob;

  public override nodeCategory: 'process' | 'input' | 'output' = 'input';

  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.data()?.nodeData.assets?.image?.url);
    });
    // TODO: ver como usar el BaseFlowNode para suscribirme al estado.
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
