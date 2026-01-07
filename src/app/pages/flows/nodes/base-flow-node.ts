import { inject, Directive, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { CustomNodeComponent } from 'ngx-vflow';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { ComponentDynamicNode } from 'ngx-vflow';
import { FlowComponentRefStateService } from '../services/flow-component-ref-state.service';
import { FlowExecutionStateService } from '../services/flow-execution-state.service';
import { IFlowExecutionState, IJobExecutionState, ITaskExecutionState, StatusJob, INodeConfig } from '../models/flows.model';
import { NodeSearchesService } from '../services/node-searches.service';
import { FlowSignalNodeStateService } from '../services/flow-signal-node-state.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ExecutionDetailsComponent } from './execution-details/execution-details';

// Intrucciones del base Node
// 1. El nodo prove la capaicidad de injectar la referencia a un estado global para encontrar rapidamente el estado y modificar sus propiedades
// 2. Se subscribe al estado de ejecucación y busca sus datos
// 3. Siempre hay 2 formas de buscar la simplificada directo con sus inputs y buscando directo en el estado por las relaciones.

// Con esta funcion el evento solo se propaga si hay un cambio de estus, quizá me cause un bug en el futuro, dejar por ahora.
function jobExecutionStateChanged(a: IJobExecutionState | null, b: IJobExecutionState | null): boolean {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return a.status === b.status && a.statusDescription === b.statusDescription;
}

@Directive()
export abstract class BaseFlowNode<T extends { config?: INodeConfig; data?: any } > extends CustomNodeComponent<T> implements OnInit, OnDestroy {
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowComponentRefStateService = inject(FlowComponentRefStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);
  public nodeSearchesService = inject(NodeSearchesService);
  protected flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  protected dialogService = inject(DialogService);

  public config = computed(() => (this.node() as any)?.config);

  public nodeCategory = computed(() => this.config()?.category || 'input');

  public nodeData = computed(() => (this.node()?.data as any)?.nodeData || this.node()?.data?.data);

  // Tengo que estandarizar como tengo el estatus del job, porque este lo uso en video, para assets, pero en agentes uso jobExecutionState hjkh
  public statusJob = signal<StatusJob>(StatusJob.COMPLETED);

  public taskExecutionState = computed(() => {
    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      if (this.nodeCategory() === 'process') {
        const executionTask = executionState?.tasks.find(t => t.processNodeId === this.node().id);
        if (executionTask) {
          return executionTask;
        }
      }
    }
    return null;
  });

  public currentStatus = computed(() => {
    return this.taskExecutionState()?.status || this.jobExecutionState()?.status || StatusJob.DEFAULT;
  });

  public statusDescription = computed(() => {
    return this.taskExecutionState()?.statusDescription || (this.jobExecutionState() as any)?.statusDescription || '';
  });

  public statusSeverity = computed(() => {
    const status = this.currentStatus();
    switch (status) {
      case StatusJob.COMPLETED:
        return 'success';
      case StatusJob.IN_PROGRESS:
        return 'info';
      case StatusJob.FAILED:
        return 'danger';
      case StatusJob.PENDING:
        return 'warn';
      default:
        return 'contrast';
    }
  });

  public jobExecutionState = computed(
    () => {
      const executionState = this.flowExecutionStateService.flowExecutionState();
      if (!executionState || this.nodeCategory() !== 'input') {
        return null;
      }

      const targetNodes = this.nodeSearchesService.getOutputNodes(this.node().id);
      if (targetNodes.length === 0) {
        return null;
      }

      // TODO: por ahora un agente solo puede estar asignado a una tarea.
      const taskNodeId = targetNodes[0].id;
      const targetTask = executionState.tasks.find((t: ITaskExecutionState) => t.processNodeId === taskNodeId);
      if (!targetTask) {
        return null;
      }

      const job = targetTask.jobs.find((j: IJobExecutionState) => j.inputNodeId === this.node().id);
      return job || null;
    },
    { equal: jobExecutionStateChanged }
  );

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.flowComponentRefStateService.addNodeComponentRef(this.node().id, this);
  }

  ngOnDestroy(): void {
    this.flowComponentRefStateService.removeNodeComponentRef(this.node().id);
  }

  removeNode(): void {
    this.flowSignalNodeStateService.removeNode(this.node().id);
  }

  selectNode(): void {
    this.selected.set(true);
  }

  duplicateNode(): void {
    this.flowSignalNodeStateService.duplicateNode(this.node().id);
  }

  openExecutionDetails(): void {
    const state = this.taskExecutionState() || this.jobExecutionState();
    if (!state) return;

    this.dialogService.open(ExecutionDetailsComponent, {
      header: `Execution Details - ${this.config()?.label || 'Node'}`,
      width: '600px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        node: this.node(),
        state: state
      }
    });
  }

  openDetails(): void {
    // Override in child class if needed
  }

  handleToolbarEvents(event: string) {
    switch (event) {
      case 'delete':
        this.removeNode();
        break;
      case 'details':
        this.openDetails();
        break;
      case 'duplicate':
        this.duplicateNode();
        break;
      case 'executionDetails':
        this.openExecutionDetails();
        break;
    }
  }
}
