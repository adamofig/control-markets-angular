import { inject, Directive, OnInit, OnDestroy, computed } from '@angular/core';
import { CustomNodeComponent } from 'ngx-vflow';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { ComponentDynamicNode } from 'ngx-vflow';
import { FlowComponentRefStateService } from '../services/flow-component-ref-state.service';
import { FlowExecutionStateService } from '../services/flow-execution-state.service';
import { IFlowExecutionState, IJobExecutionState, ITaskExecutionState } from '../models/flows.model';

// Intrucciones del base Node
// 1. El nodo prove la capaicidad de injectar la referencia a un estado global para encontrar rapidamente el estado y modificar sus propiedades
// 2. Se subscribe al estado de ejecucación y busca sus datos
// 3. Siempre hay 2 formas de buscar la simplificada directo con sus inputs y buscando directo en el estado por las relaciones.

@Directive()
export abstract class BaseFlowNode<T extends ComponentDynamicNode> extends CustomNodeComponent<T> implements OnInit, OnDestroy {
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowComponentRefStateService = inject(FlowComponentRefStateService);
  public flowExecutionStateService = inject(FlowExecutionStateService);

  public nodeCategory: 'process' | 'input' | 'output' = 'input';

  public taskExecutionState = computed(() => {
    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      if (this.nodeCategory === 'process') {
        const executionTask = executionState?.tasks.find(t => t.processNodeId === this.node().id);
        if (executionTask) {
          console.log('-------state', executionState);
          return executionTask;
        }
      }
    }
    return null;
  });

  public jobExecutionState = computed(() => {
    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.flowExecutionState();
    if (executionState) {
      if (this.nodeCategory === 'input') {
        console.log('node looking for...', this.node());
        const targetNodes = this.flowDiagramStateService.getOutputNodes(this.node().id);

        const targetNodeIds = targetNodes.map(node => node.id);

        if (targetNodeIds.length > 0) {
          // TODO: por ahora un agente solo puede estar asignado a una tarea.
          const taskNodeId = targetNodeIds[0];
          const state = this.flowExecutionStateService.getFlowExecutionState();
          const targetTask = state?.tasks.find((t: ITaskExecutionState) => t.processNodeId === taskNodeId);
          const job = targetTask?.jobs.find((j: IJobExecutionState) => j.inputNodeId === this.node().id);
          console.log('encontró su job', job);

          return job;
        }

        const executionTask = executionState?.tasks.find(t => t.processNodeId === this.node().id);
        if (executionTask) {
          console.log('-------state', executionState);
          return executionTask;
        }
      }
    }
    return null;
  });

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
    this.flowDiagramStateService.removeNode(this.node().id);
  }
}
