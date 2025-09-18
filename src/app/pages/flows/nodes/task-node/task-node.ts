import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskNodeDetailsComponent } from './task-details/task-node-details';
import { IAgentTask } from '../../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../../services/flow-execution-state.service';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { IFlowExecutionState, ITaskExecutionState, StatusJob } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';

export interface CustomTaskNode extends ComponentDynamicNode {
  nodeData: IAgentTask;
}

@Component({
  selector: 'app-task-node-details',
  imports: [Vflow, DialogModule, ButtonModule, CommonModule, JsonPipe, TagModule, ProgressSpinnerModule],
  templateUrl: './task-node.html',
  styleUrl: './task-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TaskNodeComponent extends CustomNodeComponent<CustomTaskNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowOrchestrationService = inject(FlowOrchestrationService);

  public statusJob = StatusJob;
  public agentTask = computed(() => this.node()?.data?.nodeData);

  public override ngOnInit(): void {
    super.ngOnInit();
  }

  public taskExecutionState = computed(() => {
    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      const executionTask = executionState?.tasks.find((t: ITaskExecutionState) => t.processNodeId === this.node().id);
      if (executionTask) {
        return executionTask;
      }
    }
    return null;
  });

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

  removeNode(): void {
    this.flowDiagramStateService.removeNode(this.node().id);
  }

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }
}
