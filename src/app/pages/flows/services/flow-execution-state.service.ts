import { Injectable, signal, inject, NgZone } from '@angular/core';
import { IFlowExecutionState, StatusJob, IJobExecutionState, ITaskExecutionState } from '../models/flows.model';
import { Firestore, doc, docData, DocumentReference } from '@angular/fire/firestore';
import { FlowDiagramStateService } from './flow-diagram-state.service';
import { JobService } from '../../jobs/jobs.service';

@Injectable({
  providedIn: 'root',
})
export class FlowExecutionStateService {
  private firestore = inject(Firestore);
  private ngZone = inject(NgZone);
  public flowExecutionState = signal<IFlowExecutionState | null>(null);
  private previousFlowExecutionState: IFlowExecutionState | null = null;
  private flowDiagramStateService = inject(FlowDiagramStateService);
  private jobService = inject(JobService);

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

  public initializeExecutionStateListener(flowExecutionId: string): void {
    const itemCollection: DocumentReference<any> = doc(this.firestore!, `flows_execution_state/${flowExecutionId}`);

    this.ngZone.run(() => {
      const data$ = docData(itemCollection);
      data$.subscribe(data => {
        const newExecutionState = data as IFlowExecutionState;
        this.setFlowExecutionState(newExecutionState);

        // Now, get the newly completed jobs
        const newlyCompleted = this.getNewlyCompletedJobs();

        if (newlyCompleted.length > 0) {
          console.log('Newly completed jobs:', newlyCompleted);
          // Here you can trigger your actions for each job in newlyCompleted
          newlyCompleted.forEach(job => {
            this.flowDiagramStateService.addOutcomeToFlow(job);
          });
        }
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

  // New method to get newly completed jobs
  public getNewlyCompletedJobs(): IJobExecutionState[] {
    const currentState = this.flowExecutionState();
    // previousFlowExecutionState is a class property

    if (!currentState) {
      return []; // No current state, so no newly completed jobs
    }

    const newlyCompletedJobs: IJobExecutionState[] = [];

    // Iterate over tasks in the current state
    for (const taskId in currentState.tasks) {
      if (currentState.tasks.hasOwnProperty(taskId)) {
        const currentTask: ITaskExecutionState = currentState.tasks[taskId];

        // Iterate over jobs in the current task
        for (const jobId in currentTask.jobs) {
          if (currentTask.jobs.hasOwnProperty(jobId)) {
            const currentJob: IJobExecutionState = currentTask.jobs[jobId];

            if (currentJob.status === StatusJob.COMPLETED) {
              // Check against previous state
              const previousTask = this.previousFlowExecutionState?.tasks?.[taskId];
              const previousJob = previousTask?.jobs?.[jobId];

              if (!previousJob || previousJob.status !== StatusJob.COMPLETED) {
                // Job is newly completed if:
                // 1. It didn't exist in the previous state's corresponding task/job structure.
                // 2. Or, it existed but its status was not COMPLETED.
                newlyCompletedJobs.push(currentJob);
              }
            }
          }
        }
      }
    }
    return newlyCompletedJobs;
  }
}
