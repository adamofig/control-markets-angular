import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentDynamicNode, Vflow } from 'ngx-vflow';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { IAgentCard, DefaultAgentCardsService } from '@dataclouder/ngx-agent-cards';

import { AgentDetailsComponent } from './agent-details/agent-details';
import { FlowExecutionUtilsService } from '../../services/flow-execution-utils';
import { BaseFlowNode } from '../base-flow-node';
import { INodeConfig, NodeCategory, StatusJob } from '../../models/flows.model';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';

export interface CustomAgentNode extends ComponentDynamicNode {
  data?: any;
  config: INodeConfig;
  nodeData: IAgentCard;
}

@Component({
  selector: 'app-agent-node',
  imports: [Vflow, ButtonModule, TagModule, ProgressSpinnerModule, BaseNodeToolbarComponent, CommonModule],
  templateUrl: './agent-node.component.html',
  styleUrl: './agent-node.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentNodeComponent extends BaseFlowNode<CustomAgentNode> implements OnInit {
  public flowExecutionUtilsService = inject(FlowExecutionUtilsService);
  private defaultAgentCardsService = inject(DefaultAgentCardsService);
  public agentCard = computed(() => this.nodeData());

  private fullAgentCard: IAgentCard | null = null;

  public async getFullAgentCard(): Promise<IAgentCard> {
    if (!this.fullAgentCard) {
      this.fullAgentCard = await this.defaultAgentCardsService.findOne(this.agentCard()?._id || this.agentCard()?.id || '');
    }

    return this.fullAgentCard;
  }


  constructor() {
    super();
    effect(() => {
      console.log('agent-node', this.nodeData()?.assets?.image?.url);
      
    });
    // TODO: ver como usar el BaseFlowNode para suscribirme al estado.
  }

  override ngOnInit(): void {
    super.ngOnInit();
    
    console.log('agent-node', this.node().data);
  }

  openModal(): void {
    this.dialogService.open(AgentDetailsComponent, {
      header: 'Agent Node',
      contentStyle: { 'max-height': '90vh', padding: '0px' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      modal: false,
      width: '500px',
      data: {
        agentCard: this.nodeData(),
        node: this.node().data,
      },
      maximizable: true,
      duplicate: true,
    });
  }

  override handleToolbarEvents(event: string) {
    switch (event) {
      case 'delete':
        this.removeNode();
        break;
      case 'details':
        this.openModal();
        break;
      case 'none':
        // Do nothing
        break;
    }
  }
}
