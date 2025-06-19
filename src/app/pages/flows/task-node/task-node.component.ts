import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, computed, effect, inject } from '@angular/core';
import { ComponentDynamicNode, CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskDetailsComponent } from './task-details/task-details';
import { IAgentTask } from '../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../flow-execution-state.service';

export interface CustomTaskNode extends ComponentDynamicNode {
  agentTask: IAgentTask;
}

@Component({
  selector: 'app-task-node',
  imports: [Vflow, DialogModule],
  templateUrl: './task-node.component.html',
  styleUrl: './task-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TaskNodeComponent extends CustomNodeComponent<CustomTaskNode> implements OnInit {
  public dialogService = inject(DialogService);
  public flowExecutionStateService = inject(FlowExecutionStateService);

  constructor() {
    super();
    effect(() => {
      // console.log('task-node', this.data()?.agentTask);
    });

    // probar primero aqui
    computed(() => {
      return this.flowExecutionStateService.getFlowExecutionState()?.tasks[this.node().id];
    });
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
}
