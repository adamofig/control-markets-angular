# Plan: Detecting Newly Completed Jobs in Flow Execution

This plan outlines the steps to modify the `FlowExecutionStateService` to identify jobs that have newly transitioned to the `COMPLETED` state.

**Plan Overview:**

1.  **Store Previous State**: Modify the `FlowExecutionStateService` to keep track of the `IFlowExecutionState` _before_ the latest update.
2.  **Implement `getNewlyCompletedJobs()` Method**: Add a new method to the service. This method will:
    - Iterate through all jobs in the current state.
    - For each job, check if its status is `COMPLETED`.
    - If it is, compare it with its status in the _previous_ state.
    - If the job was not `COMPLETED` in the previous state (or didn't exist), it's considered "newly completed."
3.  **Usage**: Call this new method after a state update (e.g., inside your Firebase subscription) to get the list of jobs that just finished.

**Detailed Steps:**

**Step 1: Modify `FlowExecutionStateService` to Store Previous State**

In `src/app/pages/flows/services/flow-execution-state.service.ts`:

- Add a new private property to hold the previous state:
  ```typescript
  private previousFlowExecutionState: IFlowExecutionState | null = null;
  ```
- Modify the `setFlowExecutionState` method to update this `previousFlowExecutionState` before setting the new state:
  ```typescript
  public setFlowExecutionState(state: IFlowExecutionState) {
    if (state == undefined) {
      return;
    }
    // Store the current state as the previous state before updating
    this.previousFlowExecutionState = this.flowExecutionState();
    this.flowExecutionState.set(state);
  }
  ```

**Step 2: Add `getNewlyCompletedJobs()` Method**

Still in `src/app/pages/flows/services/flow-execution-state.service.ts`, add the new method. Ensure `IJobExecutionState`, `StatusJob`, and `ITaskExecutionState` are imported from `../models/flows.model`.

```typescript
// import { IFlowExecutionState, IJobExecutionState, StatusJob, ITaskExecutionState } from '../models/flows.model';

// ... inside the FlowExecutionStateService class ...

  // Add this new private property if not already present
  private previousFlowExecutionState: IFlowExecutionState | null = null;

  // Ensure setFlowExecutionState is updated as described above

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
```

**Step 3: How to Use `getNewlyCompletedJobs()`**

You would typically call this method after the state has been updated. For example, in your `initializeExecutionStateListener` method:

```typescript
  public initializeExecutionStateListener(flowExecutionId: string): void {
    const itemCollection: DocumentReference<any> = doc(this.firestore!, `flows_execution_state/${flowExecutionId}`);

    this.ngZone.run(() => {
      const data$ = docData(itemCollection);
      data$.subscribe(data => {
        const newExecutionState = data as IFlowExecutionState;
        this.setFlowExecutionState(newExecutionState); // This now also sets previousFlowExecutionState

        // Now, get the newly completed jobs
        const newlyCompleted = this.getNewlyCompletedJobs();

        if (newlyCompleted.length > 0) {
          console.log('Newly completed jobs:', newlyCompleted);
          // Here you can trigger your actions for each job in newlyCompleted
          newlyCompleted.forEach(job => {
            // Example: this.triggerActionForJob(job);
          });
        }
      });
    });
  }
```

**Visualizing the Logic (Mermaid Diagram):**

```mermaid
graph TD
    A[Firebase State Update Received] --> B[setFlowExecutionState(newState)];
    B --> B1[Store current flowExecutionState() as previousFlowExecutionState];
    B1 --> B2[Update flowExecutionState Signal with newState];
    B2 --> C[Consumer (e.g., subscribe callback) calls getNewlyCompletedJobs()];
    C --> D{Iterate current Tasks};
    D -- Each Task --> E{Iterate current Jobs in Task};
    E -- Each Job --> F{currentJob.status === COMPLETED?};
    F -- Yes --> G{Get corresponding job from previousFlowExecutionState};
    G --> H{previousJob existed AND previousJob.status === COMPLETED?};
    H -- No (Job is newly completed) --> I[Add currentJob to newlyCompletedJobs list];
    H -- Yes (Job was already completed) --> E;
    F -- No --> E;
    I --> E;
    E -- All Jobs in Task Checked --> D;
    D -- All Tasks Checked --> J[Return newlyCompletedJobs list];
```
