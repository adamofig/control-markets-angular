import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IAgentCard, ModelSelectorComponent } from '@dataclouder/ngx-agent-cards';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { IAgentTask, ISourceTask } from '../models/tasks-models';
import { TasksService } from '../services/tasks.service';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, CardModule, ChipModule, TooltipModule, ModelSelectorComponent],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailsComponent implements OnInit {
  public task: IAgentTask | null = null;
  public id = this.route.snapshot.params['id'];

  constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef, private route: ActivatedRoute) {}

  async ngOnInit() {
    await this.getTaskIfIdParam();
  }

  private async getTaskIfIdParam() {
    if (this.id) {
      this.task = await this.tasksService.getTaskById(this.id);
      this.cdr.detectChanges();
    }
  }
}
