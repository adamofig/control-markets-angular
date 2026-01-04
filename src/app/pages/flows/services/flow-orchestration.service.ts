import { inject, Injectable } from '@angular/core';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { ICreativeFlowBoard } from '../models/flows.model';
import { FlowDiagramStateService } from './flow-diagram-state.service';
import { FlowExecutionStateService } from './flow-execution-state.service';
import { FlowSerializationService } from './flow-serialization.service';
import { FlowService } from '../flows.service';
import { FlowEventsService } from './flow-events.service';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';

@Injectable({
  providedIn: 'root',
})
export class FlowOrchestrationService {
  private flowService = inject(FlowService);
  private flowDiagramStateService = inject(FlowDiagramStateService);
  private flowSerializationService = inject(FlowSerializationService);
  private flowExecutionStateService = inject(FlowExecutionStateService);
  private flowEventsService = inject(FlowEventsService);
  private flowState = inject(FlowSignalNodeStateService);
  private toastService = inject(TOAST_ALERTS_TOKEN);

  public async saveFlow(flowId: string | null = null, flowName: string | null = null): Promise<void> {
    const currentFlow = this.flowState.flow()?.id || '';
    const currentFlowName = this.flowState.flow()?.name || '';

    try {
      const flowData = this.flowSerializationService.serializeFlow();

      const urlImages: string[] = [];
      for (const node of flowData.nodes) {
        if (node.data?.nodeData?.type === 'image' && node.data?.nodeData?.storage?.url) {
          urlImages.push(node.data.nodeData.storage.url);
        }
      }

      const flow: ICreativeFlowBoard = {
        id: flowId || currentFlow,
        name: flowName || currentFlowName,
        nodes: flowData.nodes,
        edges: flowData.edges,
        metadata: {
          totalNodes: flowData.nodes.length,
          totalEdges: flowData.edges.length,
          inputNodes: flowData.nodes.filter(n => n.category === 'input').length,
          outputNodes: flowData.nodes.filter(n => n.category === 'output').length,
          processNodes: flowData.nodes.filter(n => n.category === 'process').length,
          urlImages: urlImages,
        },
      };

      await this.flowService.saveFlow(flow);
      this.toastService.success({
        title: 'Flow saved successfully',
        subtitle: 'Your changes have been saved.',
      });
    } catch (error) {
      console.error('Error saving flow:', error);
      this.toastService.error({
        title: 'Error Saving Flow',
        subtitle: `${error}`,
      });
      throw error; // Re-throw to allow the component to handle loading states
    }
  }

  public async runFlow(flowId: string, flowName: string): Promise<void> {
    try {
      this.flowEventsService.disconnect();
      await this.saveFlow(flowId, flowName);
      const result = await this.flowService.runFlow(flowId);
      if (result && result.flowExecutionId) {
        this.flowExecutionStateService.initializeExecutionStateListener(result.flowExecutionId);
        this.flowEventsService.subscribeToFlow(flowId).subscribe();
        // Optionally navigate to the execution view
        // this.router.navigate(['../', flowId, 'executions', result.executionId], { relativeTo: this.route });
      } else {
        this.toastService.warn({
          title: 'Run Flow Warning',
          subtitle: 'Could not initialize execution listener, execution ID missing.',
        });
      }
    } catch (error) {
      console.error('Error running flow:', error);
      this.toastService.error({
        title: 'Error Running Flow',
        subtitle: 'An error occurred while trying to run the flow.',
      });
      throw error; // Re-throw
    }
  }

  public async runNode(flowId: string, nodeId: string): Promise<void> {
    // This actually must decide if should save before running the node, for now always
    // TODO: add logic to save if is not saved latest.
    const savedFlow = await this.saveFlow(flowId, this.flowDiagramStateService.getFlow()?.name || '');
    this.toastService.info({ title: 'Flow saved', subtitle: 'Flow as saved before running node.' });

    try {
      const result: any = await this.flowService.runNode(flowId, nodeId);
      if (result && result.flowExecutionId) {
        this.flowExecutionStateService.initializeExecutionStateListener(result.flowExecutionId);
        this.flowEventsService.subscribeToFlow(flowId).subscribe();
      } else {
        this.toastService.warn({
          title: 'Run Node Warning',
          subtitle: 'Could not initialize execution listener, execution ID missing.',
        });
      }
    } catch (error) {
      console.error('Error running node:', error);
      this.toastService.error({
        title: 'Error Running Node',
        subtitle: 'An error occurred while trying to run the node.',
      });
      throw error; // Re-throw
    }
  }

  public async runEndPoint(flowId: string, nodeId: string): Promise<void> {
    try {
      const result: any = await this.flowService.runEndPoint(flowId, nodeId);
      if (result && result.flowExecutionId) {
        this.flowExecutionStateService.initializeExecutionStateListener(result.flowExecutionId);
        this.flowEventsService.subscribeToFlow(flowId).subscribe();
      } else {
        this.toastService.warn({
          title: 'Run EndPoint Warning',
          subtitle: 'Could not initialize execution listener, execution ID missing.',
        });
      }
    } catch (error) {
      console.error('Error running node:', error);
      this.toastService.error({
        title: 'Error Running EndPoint',
        subtitle: 'An error occurred while trying to run the node.',
      });
      throw error; // Re-throw
    }
  }

  public async loadInitialFlow(flowId: string, executionId?: string): Promise<ICreativeFlowBoard> {
    const flow = await this.flowService.getFlow(flowId);
    if (flow) {
      this.flowDiagramStateService.setFlow(flow);
      this.flowSerializationService.loadFlow(flow as any);
      if (executionId) {
        this.flowExecutionStateService.initializeExecutionStateListener(executionId);
        this.flowEventsService.subscribeToFlow(flowId).subscribe();
      }
    }
    return flow;
  }

  // public async createNewFlow(): Promise<void> {
  //   const newFlow: ICreativeFlowBoard = { id: '' };
  //   const savedFlow = await this.flowService.saveFlow(newFlow);
  //   this.router.navigate(['./', savedFlow.id], { relativeTo: this.route });
  // }
}
