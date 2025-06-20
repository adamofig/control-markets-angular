import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicNode, Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
import { IAgentTask } from 'src/app/pages/tasks/models/tasks-models';

@Component({
  selector: 'app-task-details',
  imports: [Vflow, DialogModule, JsonPipe],
  templateUrl: './task-details.html',
  styleUrl: './task-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public node!: any;
  public agentTask!: IAgentTask;

  public task: any | null = null;

  constructor() {
    this.node = this.dynamicDialogConfig.data;
    this.agentTask = this.node.data.agentTask;
  }

  ngOnInit(): void {
    console.log('task-details', this.task);
  }
}
