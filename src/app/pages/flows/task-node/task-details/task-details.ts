import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';

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

  public task: any | null = null;

  constructor() {
    this.task = this.dynamicDialogConfig.data;
  }

  ngOnInit(): void {
    console.log('task-details', this.task);
    debugger;
  }
}
