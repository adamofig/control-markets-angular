import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { CustomNodeComponent, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TaskDetailsComponent } from '../task-details/task-details';

export type NodeData = {
  text: string;
  image: string;
};

@Component({
  selector: 'app-task-node',
  imports: [Vflow, DialogModule],
  templateUrl: './task-node.component.html',
  styleUrl: './task-node.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TaskNodeComponent extends CustomNodeComponent<NodeData> implements OnInit {
  public dialogService = inject(DialogService);

  constructor() {
    super();
    effect(() => {
      console.log('task-node', this.data()?.text);
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
    });
  }
}
