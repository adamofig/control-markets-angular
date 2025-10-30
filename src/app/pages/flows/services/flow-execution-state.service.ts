import { Injectable, signal, inject, NgZone } from '@angular/core';
import { IFlowExecutionState, StatusJob, IJobExecutionState, ITaskExecutionState } from '../models/flows.model';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { FlowDiagramStateService } from './flow-diagram-state.service';
import { FlowNodeCreationService } from './flow-node-creation.service';

@Injectable({
  providedIn: 'root',
})
export class FlowExecutionStateService {
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  public flowExecutionState = signal<IFlowExecutionState | null>(null);
  private previousFlowExecutionState: IFlowExecutionState | null = null;
  private flowDiagramStateService = inject(FlowDiagramStateService);
  private flowNodeCreationService = inject(FlowNodeCreationService);

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
    this.previousFlowExecutionState = this.flowExecutionState(); // Store current as previous
    this.flowExecutionState.set(state);
  }

  public getDocReference(flowExecutionId: string) {
    return doc(this.firestore, `flows_execution_state/${flowExecutionId}`);
  }

  public async initializeExecutionStateListener(flowExecutionId: string): Promise<void> {
    const docRef = this.getDocReference(flowExecutionId);

    docData(docRef).subscribe(data => {
      const newExecutionState = data as IFlowExecutionState;
      this.setFlowExecutionState(newExecutionState);

      // Now, get the newly completed jobs
      this.updateJobNodes();
    });
  }

  private updateJobNodes() {
    const justCompletedJobs = this.getJustCompletedJobs();

    if (justCompletedJobs.length > 0) {
      console.log('justCompletedJobs', justCompletedJobs);
      // Here you can trigger your actions for each job in newlyCompleted
      justCompletedJobs.forEach(job => {
        const audio = new Audio('assets/audios/notifications/end-whistle.wav');
        audio.play();

        if (job.resultType === 'outcome') {
          this.flowDiagramStateService.addOutcomeToFlow(job);
        } else if (job.resultType === 'generatedAsset') {
          this.flowNodeCreationService.addGeneratedAssetNodeToFlow(job);
        }
      });
    }
  }

  // Optional: Method to initialize with a default state if needed
  public initializeDefaultState(flowId: string, executionId: string) {
    const defaultState: IFlowExecutionState = {
      id: executionId,
      flowExecutionId: executionId,
      flowId: flowId,
      status: StatusJob.PENDING,
      tasks: [],
    };
    this.flowExecutionState.set(defaultState);
  }

  // New method to get newly completed jobs
  public getJustCompletedJobs(): IJobExecutionState[] {
    const currentState = this.flowExecutionState();
    // previousFlowExecutionState is a class property

    if (!currentState) {
      return []; // No current state, so no newly completed jobs
    }

    const newlyCompletedJobs: IJobExecutionState[] = [];

    // Iterate over tasks in the current state
    // Iterate over tasks in the current state
    for (const currentTask of currentState.tasks) {
      // Iterate over jobs in the current task
      for (const currentJob of currentTask.jobs) {
        if (currentJob.status === StatusJob.COMPLETED) {
          // Check against previous state
          const previousTask = this.previousFlowExecutionState?.tasks?.find((t: ITaskExecutionState) => t.processNodeId === currentTask.processNodeId);
          const previousJob = previousTask?.jobs?.find((j: IJobExecutionState) => j.inputNodeId === currentJob.inputNodeId);

          if (!previousJob || previousJob.status !== StatusJob.COMPLETED) {
            // Job is newly completed if:
            // 1. It didn't exist in the previous state's corresponding task/job structure.
            // 2. Or, it existed but its status was not COMPLETED.
            newlyCompletedJobs.push(currentJob);
          }
        }
      }
    }
    return newlyCompletedJobs;
  }
}
