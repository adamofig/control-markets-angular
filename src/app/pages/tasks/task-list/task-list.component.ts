import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TasksService } from '../services/tasks.service';
import { DCFilterBarComponent, FiltersConfig, PaginationBase, PColumn, QuickTableComponent } from '@dataclouder/ngx-core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastAlertService } from 'src/app/services/toast.service';
import { DialogModule } from 'primeng/dialog';
import { ChatMessage, DCConversationPromptBuilderService } from '@dataclouder/ngx-agent-cards';
import { AgentCardService } from 'src/app/services/agent-cards.service';
import { PaginatorModule } from 'primeng/paginator';
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DCFilterBarComponent, CardModule, ButtonModule, DialogModule, QuickTableComponent, PaginatorModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent extends PaginationBase implements OnInit {
  @Input() public viewTable = false;
  @Output() public onSelect = new EventEmitter<any>();

  public tasks: any[] = [];
  loadingTasks: { [key: string]: boolean } = {};
  public columns: PColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'status', header: 'Status' },
    { field: 'taskType', header: 'Task Type' },
  ];

  public showTaksDetails = false;
  public selectedTask: any;

  public filters: FiltersConfig = { filters: {}, page: 0, rowsPerPage: 10, sort: { _id: -1 } };

  constructor(
    private tasksService: TasksService,
    public override router: Router,
    public override route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toastService: ToastAlertService,
    private promptBuilderService: DCConversationPromptBuilderService,
    private agentCardService: AgentCardService
  ) {
    super(route, router);
  }
  ngOnInit() {
    this.getTasks();
  }

  onNew() {
    console.log('onNew');
    this.router.navigate(['./edit'], { relativeTo: this.route });
  }

  public async getTasks() {
    const tasks = await this.tasksService.getFilteredTasks(this.filters);
    this.tasks = tasks.rows;
    this.cdr.detectChanges();
  }

  public onFilterChange(filters: FiltersConfig) {
    console.log('onFilterChange', filters);
    this.getTasks();
  }

  public editTask(task: any) {
    console.log('editTask', task);

    this.router.navigate(['./edit', task._id], { relativeTo: this.route });
  }

  public async deleteTask(task: any) {
    const isConfirmed = confirm('¿Estás seguro de querer eliminar esta tarea?');
    if (isConfirmed) {
      console.log('deleteTask', task);
      try {
        await this.tasksService.deleteTask(task._id);
        this.tasks = this.tasks.filter(t => t._id !== task._id);
        this.cdr.detectChanges();
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  }

  public async executeTask(task: any) {
    this.loadingTasks[task._id] = true;
    try {
      this.toastService.info({ title: 'Ejecutando tarea...', subtitle: 'Puede tardar hasta 1 minuto, sé paciente' });
      await this.tasksService.executeTask(task._id);
      this.toastService.success({ title: 'Tarea ejecutada correctamente', subtitle: 'Los resultados se han guardado' });
    } catch (error) {
      console.error('Error executing task', error);
      this.toastService.error({ title: 'Error al ejecutar la tarea', subtitle: 'Por favor, inténtelo de nuevo más tarde' });
    } finally {
      this.loadingTasks[task._id] = false;
      this.cdr.detectChanges();
    }
  }

  public viewResults(task: any) {
    this.router.navigate(['./jobs', task._id], { relativeTo: this.route });
  }

  public promptMessages: ChatMessage[] = [];
  public async viewTask(task: any) {
    this.selectedTask = task;

    const agentCard = await this.agentCardService.findConversationCardByID(task.agentCard.id);
    console.log('agentCard', agentCard);
    this.promptMessages = this.promptBuilderService.buildConversationMessages(agentCard);
    this.showTaksDetails = true;
    this.cdr.detectChanges();
  }

  protected override async loadData(): Promise<void> {
    const tasks = await this.tasksService.getFilteredTasks(this.filters);
    this.tasks = tasks.rows;
  }

  public selectItem(item: any) {
    console.log('onSelect');
    this.onSelect.emit(item);
  }
}
