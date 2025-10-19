import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow, HandleComponent } from 'ngx-vflow';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskNodeDetailsComponent } from './task-details/task-node-details';
import { IAgentTask } from '../../../tasks/models/tasks-models';
import { IFlowExecutionState, ITaskExecutionState, StatusJob } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { APP_CONFIG } from '@dataclouder/ngx-core';
import { BaseFlowNode } from '../base-flow-node';
import { NodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { ActionsToolbarComponent } from '../actions-toolbar/actions-toolbar.component';

export interface CustomTaskNode extends ComponentDynamicNode {
  nodeData: IAgentTask;
}

@Component({
  selector: 'app-task-node-details',
  imports: [
    Vflow,
    DialogModule,
    ButtonModule,
    CommonModule,
    JsonPipe,
    TagModule,
    ProgressSpinnerModule,
    HandleComponent,
    NodeToolbarComponent,
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

  public agentTask = computed(() => this.node()?.data?.nodeData);
  public statusJobEnum = StatusJob;

  public override nodeCategory: 'process' | 'input' | 'output' = 'process';

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
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
      data: this.node(),
      width: '450px',
    });
  }

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }

  public getExecutionUrl(): string {
    // /api/agent-flows/run-node?flowId=sdfsdf&nodeId=sdfsdf
    const exeUrl = `${this.appConfig.backendNodeUrl}/api/agent-flows/run-node?flowId=${this.flowDiagramStateService.getFlow()?.id}&nodeId=${this.node().id}`;
    alert(exeUrl);
    return exeUrl;
  }

  handleActionsToolbarEvents(event: 'runNode' | 'runEndPoint'): void {
    switch (event) {
      case 'runNode':
        this.runNode();
        break;
      case 'runEndPoint':
        this.getExecutionUrl();
        break;
    }
  }
}
