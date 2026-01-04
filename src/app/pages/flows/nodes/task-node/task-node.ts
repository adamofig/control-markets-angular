import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow, HandleComponent } from 'ngx-vflow';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskNodeDetailsComponent } from './task-details/task-node-details';
import { TaskConversationComponent } from './task-conversation/task-conversation';
import { TaskWebhookDetailsComponent } from './task-webhook-details/task-webhook-details';
import { ILlmTask } from '../../../tasks/models/tasks-models';
import { IFlowExecutionState, INodeConfig, ITaskExecutionState, StatusJob } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { APP_CONFIG } from '@dataclouder/ngx-core';
import { BaseFlowNode } from '../base-flow-node';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { ActionsToolbarComponent } from '../actions-toolbar/actions-toolbar.component';

export interface CustomTaskNode extends ComponentDynamicNode {
  data?: any;
  config: INodeConfig;
  nodeData: ILlmTask;
}

@Component({
  selector: 'app-task-node-details',
  imports: [
    Vflow,
    DialogModule,
    ButtonModule,
    CommonModule,
    TagModule,
    ProgressSpinnerModule,
    HandleComponent,
    BaseNodeToolbarComponent,
    ActionsToolbarComponent,
  ],
  templateUrl: './task-node.html',
  styleUrls: ['./task-node.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TaskNodeComponent extends BaseFlowNode<CustomTaskNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowOrchestrationService = inject(FlowOrchestrationService);
  public appConfig = inject(APP_CONFIG);

  public agentTask = computed(() => this.nodeData());
  public statusJobEnum = StatusJob;
  public status = computed(() => this.taskExecutionState()?.status || this.statusJobEnum.PENDING);


  public override ngOnInit(): void {
    super.ngOnInit();
  }

  constructor() {
    super();
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;
    this.dialogService.open(TaskNodeDetailsComponent, {
      header: 'Task Node Details',
      contentStyle: { 'max-height': '90vh', padding: '0px' },
      baseZIndex: 10000,
      draggable: true,
      modal: false,
      styleClass: 'draggable-dialog',
      closable: true,
      data: this.node(),
      width: '550px',
    });
  }

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }

  public getExecutionUrl(): void {
    // /api/agent-flows/run-node?flowId=sdfsdf&nodeId=sdfsdf
    // const exeUrl = `${this.appConfig.backendNodeUrl}/api/agent-flows/run-node?flowId=${this.flowDiagramStateService.getFlow()?.id}&nodeId=${this.node().id}`;

    const postRequest = {
      method: 'POST',
      host: this.appConfig.backendNodeUrl,
      service: 'api/agent-flows/webhook/node',
      body: {
        flowId: this.flowDiagramStateService.getFlow()?.id,
        nodeId: this.node().id,
      },
    };

    this.dialogService.open(TaskWebhookDetailsComponent, {
      header: 'Webhook URL',
      width: '550px',
      height: '650px',
      contentStyle: { 'max-height': '90vh', overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      data: {
        postRequest: postRequest,
      },
    });
  }

  handleActionsToolbarEvents(event: 'runNode' | 'getExecutionUrl' | 'runEndPoint'): void {
    switch (event) {
      case 'runNode':
        this.runNode();
        break;
      case 'getExecutionUrl':
        this.getExecutionUrl();
        break;
      case 'runEndPoint':
        this.flowOrchestrationService.runEndPoint(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
        break;
    }
  }

  startConversation(): void {
    this.dialogService.open(TaskConversationComponent, {
      header: 'Conversation',
      width: '550px',
      height: '800px',
      modal: false,
      contentStyle: { 'max-height': '90vh', overflow: 'auto', height: '100%' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      data: this.node(),
      maximizable: true,
    });
  }
}
