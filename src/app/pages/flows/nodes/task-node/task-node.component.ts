import { CommonModule, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskDetailsComponent } from './task-details/task-details';
import { IAgentTask } from '../../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../../services/flow-execution-state.service';
import { FlowDiagramStateService } from '../../services/flow-diagram-state.service';
import { IFlowExecutionState } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';

export interface CustomTaskNode extends ComponentDynamicNode {
  agentTask: IAgentTask;
}

@Component({
  selector: 'app-task-node',
  imports: [Vflow, DialogModule, ButtonModule, CommonModule, JsonPipe, TagModule],
  templateUrl: './task-node.component.html',
  styleUrl: './task-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TaskNodeComponent extends CustomNodeComponent<CustomTaskNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public flowDiagramStateService = inject(FlowDiagramStateService);

  public agentTask = computed(() => this.node()?.data?.agentTask);

  public override ngOnInit(): void {
    super.ngOnInit();
    console.log('task-node', this.agentTask());
  }

  public taskExecutionState = computed(() => {
    console.log('taskExecutionState', this.agentTask());

    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      const executionTask = executionState?.tasks[this.node().id];
      console.log('-------state', executionState);

      return executionTask;
    }
    return null;
  });

  constructor() {
    super();
    effect(() => {
      // console.log('task-node', this.data()?.agentTask);
    });

    effect(() => {
      const stateFromService = this.flowExecutionStateService.flowExecutionState();
      console.log('[TaskNodeComponent] Effect triggered. flowExecutionState from service:', stateFromService, 'for node ID:', this.node()?.id);
    });

    // probar primero aqui
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;
    this.dialogService.open(TaskDetailsComponent, {
      header: 'Task Node',
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
}
