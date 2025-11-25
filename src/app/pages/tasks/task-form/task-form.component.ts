import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAgentCard, ModelSelectorComponent } from '@dataclouder/ngx-agent-cards';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

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
import { AspectType, ResolutionType, CropperComponentModal } from '@dataclouder/ngx-cloud-storage';
import { EModelQuality, EntityBaseFormComponent, EntityCommunicationService } from '@dataclouder/ngx-core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    SelectModule,
    TextareaModule,
    AutoCompleteModule,
    ChipModule,
    TooltipModule,
    ModelSelectorComponent,
    CropperComponentModal,
    TooltipModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent extends EntityBaseFormComponent<IAgentTask> implements OnInit {
  public form: FormGroup<any> = this.fb.group({});

  protected override entityCommunicationService = inject(TasksService);
  protected override patchForm(entity: IAgentTask): void {
    this.form.patchValue(entity);
  }

  public task = signal<IAgentTask | null>(null);
  public sourceSuggestions: ISourceTask[] = [];
  public selectedSource: string = '';
  public selectedAssets: any = null;

  public storageImgSettings = {
    path: `jobs`,
    cropSettings: { aspectRatio: AspectType.horizontal_3_2, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  public dbOptions: any[] = [];

  public taskForm = this.fb.group({
    _id: [''],
    agentCards: this.fb.control<any[]>([]),
    notionOutput: this.fb.control<any>({}),
    name: ['', Validators.required],
    description: [''],
    userPrompt: [''],
    status: [AgentTaskStatus.ACTIVE],
    taskType: [AgentTaskType.TEXT_RESPONSE],
    sources: this.fb.control<any[]>([]),
    taskAttached: this.fb.control<any>({}),
    output: this.fb.control<ITaskOutput>({}),
    model: this.fb.nonNullable.group({
      provider: '',
      modelName: '',
      id: '',
      quality: EModelQuality.FAST,
    }),
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
    private sourceService: SourceService
  ) {
    super();
  }

  async ngOnInit() {
    await this.getTaskIfIdParam();
    this.getAgentCards();
    this.getAgentSources();
    this.getAgentTasks();
  }

  public handleImageUpload(event: any) {
    this.uploadImage(event);
  }

  private async getAgentTasks() {
    const taskAttached = await this.tasksService.getFilteredTasks({ returnProps: { id: 1, name: 1 } });
    this.taskAttachedOptions = taskAttached.rows.map((task: IAgentTask) => ({ name: task.name, id: task._id }));
    console.log('Task attached options:', this.taskAttachedOptions);
  }

  private async getTaskIfIdParam() {
    if (this.entityId()) {
      this.task.set(await this.tasksService.getTaskById(this.entityId()));
      if (this.task()?.output?.type === 'notion_database') {
        this.dbOptions = [this.task()?.output];
      }
      this.taskForm.patchValue(this.task() as any);
      this.cdr.detectChanges();
    }
  }

  public addSourceToTask(event: SelectChangeEvent) {
    this.taskForm.patchValue({
      sources: [...(this.taskForm.controls.sources.value || []), event.value],
    });
    console.log('Sources:', this.taskForm.controls.sources.value);
    this.cdr.detectChanges();
  }

  private async getAgentSources() {
    const sources = await this.sourceService.query({ returnProps: { id: 1, name: 1 } });
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

  public async uploadImage(image: any) {
    const taskData: Partial<IAgentTask> = {
      id: this.task()?.id || '',
      image: image,
    };

    await this.tasksService.saveTask(taskData);
    const updatedTask = { ...this.task(), ...taskData } as IAgentTask;
    this.task.set(updatedTask);

    this.toastService.success({ title: 'Tarea actualizada', subtitle: 'Tarea actualizada correctamente' });
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
