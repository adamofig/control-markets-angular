import { ChangeDetectionStrategy, Component, computed, inject, OnInit, Signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicNode, Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
import { IAgentTask } from 'src/app/pages/tasks/models/tasks-models';
import { TaskDetailsComponent } from 'src/app/pages/tasks/task-details/task-details.component';
import { DynamicNodeWithData, FlowDiagramStateService } from 'src/app/pages/flows/services/flow-diagram-state.service';
import { NodeSearchesService } from '../../../services/node-searches.service';

@Component({
  selector: 'app-task-node-details',
  imports: [Vflow, DialogModule, JsonPipe, TaskDetailsComponent],
  templateUrl: './task-node-details.html',
  styleUrl: './task-node-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskNodeDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public nodeSearchesService = inject(NodeSearchesService);
  public node!: any;
  public agentTask!: IAgentTask;

  public task: any | null = null;
  public connectedNodes!: DynamicNodeWithData[];

  constructor() {
    this.node = this.dynamicDialogConfig.data;
    this.agentTask = this.node.data.nodeData;
  }

  ngOnInit(): void {
    debugger;
    this.connectedNodes = this.nodeSearchesService.getInputNodes(this.node.id);

    console.log('inputs', this.connectedNodes);
  }
}
