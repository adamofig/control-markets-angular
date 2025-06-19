import { Injectable, signal } from '@angular/core';
import { IFlowExecutionState, StatusJob } from './models/flows.model';

@Injectable({
  providedIn: 'root',
})
export class FlowExecutionStateService {
  private flowExecutionState = signal<IFlowExecutionState | null>(null);

  public getFlowExecutionState() {
    return this.flowExecutionState();
  }

  public setFlowExecutionState(state: IFlowExecutionState) {
    debugger;
    this.flowExecutionState.set(state);
  }

  // Optional: Method to initialize with a default state if needed
  public initializeDefaultState(flowId: string, executionId: string) {
    const defaultState: IFlowExecutionState = {
      id: executionId,
      flowId: flowId,
      status: StatusJob.PENDING,
      tasks: {},
    };
    this.flowExecutionState.set(defaultState);
  }
}
