import { Injectable, signal, inject, NgZone } from '@angular/core';
import { IFlowExecutionState, IJobExecutionState, ITaskExecutionState } from '../models/flows.model';
// import { Firestore, doc, docData, DocumentReference, getDoc } from '@angular/fire/firestore';
import { DynamicNodeWithData, FlowDiagramStateService } from './flow-diagram-state.service';
import { FlowExecutionStateService } from './flow-execution-state.service';

@Injectable({
  providedIn: 'root',
})
export class FlowExecutionUtilsService {
  private flowDiagramStateService = inject(FlowDiagramStateService);
  private flowExecutionStateService = inject(FlowExecutionStateService);

  public getAgentExecutionState(node: DynamicNodeWithData) {
    const agentCard = node.data?.agentCard;
    const agentId: string = agentCard?.id || agentCard?._id || '';

    const executionState: IFlowExecutionState | null = this.flowExecutionStateService.getFlowExecutionState();
    if (executionState) {
      const taskId: string = agentId;

      const targetNodes = this.flowDiagramStateService.getOutputNodes(node.id);
      const targetNodeIds = targetNodes.map(node => node.id);

      if (targetNodeIds.length > 0) {
        // TODO: por ahora un agente solo puede estar asignado a una tarea.
        const taskNodeId = targetNodeIds[0];
        const state = this.flowExecutionStateService.getFlowExecutionState();
        const targetTask = state?.tasks.find((t: ITaskExecutionState) => t.processNodeId === taskNodeId);
        const job = targetTask?.jobs.find((j: IJobExecutionState) => j.inputNodeId === node.id);
        console.log('encontró su job', job);

        return job;
      }

      const executionTask = executionState?.tasks.find((t: ITaskExecutionState) => t.processNodeId === taskId);

      return executionTask;
    }
    return null;
  }
}
