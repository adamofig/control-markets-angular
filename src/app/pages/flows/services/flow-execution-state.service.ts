import { Injectable, signal, inject, NgZone } from '@angular/core';
import { IFlowExecutionState, StatusJob } from '../models/flows.model';
import { Firestore, doc, docData, DocumentReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FlowExecutionStateService {
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  public flowExecutionState = signal<IFlowExecutionState | null>(null);

  public getFlowExecutionState() {
    // Returns the current value
    return this.flowExecutionState();
  }

  public getFlowExecutionStateSignal() {
    // Returns the signal itself (readonly)
    return this.flowExecutionState.asReadonly();
  }

  public setFlowExecutionState(state: IFlowExecutionState) {
    if (state == undefined) {
      return;
    }
    console.log('[FlowExecutionStateService] setFlowExecutionState CALLED. Current state before set:', this.flowExecutionState());
    console.log('[FlowExecutionStateService] New state to set:', state);
    // Removed debugger
    this.flowExecutionState.set(state);
    console.log('[FlowExecutionStateService] State AFTER set:', this.flowExecutionState());
  }

  public initializeExecutionStateListener(flowExecutionId: string): void {
    const itemCollection: DocumentReference<any> = doc(this.firestore!, `flows_execution_state/${flowExecutionId}`);

    this.ngZone.run(() => {
      const data$ = docData(itemCollection);
      data$.subscribe(data => {
        this.setFlowExecutionState(data as IFlowExecutionState);
      });
    });
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
