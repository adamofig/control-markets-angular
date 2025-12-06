import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IAgentCard, ModelSelectorComponent } from '@dataclouder/ngx-agent-cards';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ILlmTask, ISourceTask } from '../models/tasks-models';
import { TasksService } from '../services/tasks.service';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, ChipModule, TooltipModule, ModelSelectorComponent, MarkdownComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent implements OnInit {
  public task: ILlmTask | null = null;
  @Input() public id: string | null = null;
  private routeId = this.route.snapshot.params['id'];

  constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  async ngOnInit() {
    await this.getTaskIfIdParam();
  }

  private async getTaskIfIdParam() {
    const taskId = this.id ?? this.routeId;
    if (taskId) {
      this.task = await this.tasksService.getTaskById(taskId);
      this.cdr.detectChanges();
    }
  }
}
