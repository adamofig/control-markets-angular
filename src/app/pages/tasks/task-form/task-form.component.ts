import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAgentCard, ProviderSelectorComponent } from '@dataclouder/conversation-system';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';

import { TextareaModule } from 'primeng/textarea';

import {
  IAgentTask,
  AgentTaskOptions,
  AgentTaskStatus,
  AgentTaskStatusOptions,
  AgentTaskType,
  ISourceTask,
  ITaskOutput,
  IAIModel,
} from '../models/tasks-models';
import { TasksService } from '../services/tasks.service';
import { AgentCardService } from 'src/app/services/agent-cards.service';
import { NotionService } from '../services/notion.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastAlertService } from 'src/app/services/toast.service';
import { SourceService } from '../../sources/sources.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DropdownModule,
    SelectModule,
    TextareaModule,
    AutoCompleteModule,
    ChipModule,
    TooltipModule,
    ProviderSelectorComponent,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit {
  public task: IAgentTask | null = null;
  public sourceSuggestions: ISourceTask[] = [];
  public selectedSource: string = '';
  public selectedAssets: any = null;
  public id = this.route.snapshot.params['id'];

  public dbOptions: any[] = [];

  public taskForm = this.fb.group({
    _id: [''],
    agentCards: this.fb.control<any[]>([]),
    notionOutput: this.fb.control<any>({}),
    name: ['', Validators.required],
    description: [''],
    status: [AgentTaskStatus.ACTIVE],
    taskType: [AgentTaskType.CREATE_CONTENT],
    sources: this.fb.control<any[]>([]),
    taskAttached: this.fb.control<any>({}),
    output: this.fb.control<ITaskOutput>({}),
    model: this.fb.group({ provider: [''], modelName: [''], id: [''] }),
  });

  public taskTypes = AgentTaskOptions;

  public statuses = AgentTaskStatusOptions;
  public sourcesOptions: ISourceTask[] = [];
  public agentOptions: IAgentCard[] = [];
  public taskAttachedOptions: Partial<IAgentTask>[] = [];

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
    private agentCardService: AgentCardService,
    private notionService: NotionService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastAlertService,
    private sourceService: SourceService
  ) {}

  async ngOnInit() {
    await this.getTaskIfIdParam();
    this.getAgentCards();
    this.getAgentSources();
    this.getAgentTasks();

    // this.taskForm.controls.taskType.valueChanges.subscribe(async value => {
    //   if (value === AgentTaskType.REVIEW_TASK) {
    //     // this.taskForm.controls.taskAttached.setValidators([Validators.required]);
    //     // this.taskForm.controls.taskAttached.enable();
    //     const optionAttached = await this.tasksService.getFilteredTasks({});
    //     console.log('Task attached options:', optionAttached);
    //     this.taskAttachedOptions = optionAttached.rows.map((task: IAgentTask) => ({
    //       name: task.name,
    //       id: task._id,
    //     }));
    //     console.log('Task attached options:', this.taskAttachedOptions);
    //   } else {
    //     // this.taskForm.controls.taskAttached.clearValidators();
    //     this.taskForm.controls.taskAttached.disable();
    //   }
    //   // this.taskForm.controls.taskAttached.updateValueAndValidity();
    // });
  }

  private async getAgentTasks() {
    const taskAttached = await this.tasksService.getFilteredTasks({ returnProps: { id: 1, name: 1 } });
    this.taskAttachedOptions = taskAttached.rows.map((task: IAgentTask) => ({ name: task.name, id: task._id }));
    console.log('Task attached options:', this.taskAttachedOptions);
  }

  private async getTaskIfIdParam() {
    if (this.id) {
      this.task = await this.tasksService.getTaskById(this.id);
      if (this.task?.output?.type === 'notion_database') {
        this.dbOptions = [this.task.output];
      }
      console.log('Task:', this.task);

      this.taskForm.patchValue(this.task as any);
      console.log('Task:', this.taskForm.value);

      this.cdr.detectChanges();
    }
  }

  public addSourceToTask(event: { originalEvent: any; value: ISourceTask }) {
    this.taskForm.patchValue({
      sources: [...(this.taskForm.controls.sources.value || []), event.value],
    });
    console.log('Sources:', this.taskForm.controls.sources.value);
    this.cdr.detectChanges();
  }

  private async getAgentSources() {
    const sources = await this.sourceService.getFilteredSources({ returnProps: { id: 1, name: 1 } });
    this.sourcesOptions = sources.rows;
    console.log('Sources options:', sources);

    this.cdr.detectChanges();
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      const taskData: IAgentTask = this.taskForm.value as any;
      console.log('Task submitted:', taskData);
      const task = await this.tasksService.saveTask(taskData);
      if (!this.id) {
        this.router.navigate([task._id], { relativeTo: this.route });
      } else {
        this.toastService.success({ title: 'Tarea actualizada', subtitle: 'Tarea actualizada correctamente' });
      }
    }
  }

  private async getAgentCards() {
    const agentCards = await this.agentCardService.findAgentCards({ returnProps: { id: 1, title: 1, assets: 1 } });

    this.agentOptions = agentCards.rows.map((card: IAgentCard) => ({
      title: card.title || 'Untitled Card',
      id: card.id,
      assets: card.assets,
      name: card?.characterCard?.data?.name,
    }));

    this.cdr.detectChanges();
  }

  public async getNotionDBs() {
    this.toastService.info({ title: 'Buscando bases de datos en Notion', subtitle: 'Espere un momento...' });
    const notionDBs = await this.notionService.getDBAvailible();
    this.dbOptions = notionDBs.databases.map((db: any) => ({ name: db.title, id: db.id, type: 'notion_database' }));

    console.log('DBs:', this.dbOptions);
    this.toastService.success({ title: 'Bases encontradas', subtitle: 'Selecciona alguna' });
    this.cdr.detectChanges();
  }

  public removeSource(sourceToRemove: string) {
    const currentSources = this.taskForm.get('sources')?.value || [];
    this.cdr.detectChanges();
  }

  selectSource(event: any) {
    this.selectedSource = event.value;
    const currentSources = this.taskForm.controls.sources.value ?? [];

    this.taskForm.patchValue({ sources: [...currentSources, this.selectedSource] });
  }

  onAgentCardChange(event: any) {
    // let agentCard: any = this.agentOptions.find(option => option.id === event.value);
    // agentCard = { ...agentCard, id: event.value };
    this.taskForm.patchValue({
      agentCards: [...(this.taskForm.controls.agentCards.value || []), event.value],
    });
    console.log('Agent cards:', this.taskForm.controls.agentCards.value);
  }

  removeAgentCard(agentCard: any) {
    const currentAgentCards = this.taskForm.controls.agentCards.value || [];
    this.taskForm.patchValue({
      agentCards: currentAgentCards.filter((card: any) => card.id !== agentCard.id),
    });
  }
}
