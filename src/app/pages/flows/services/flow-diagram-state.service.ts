import { inject, Injectable, signal, Type } from '@angular/core';
import { IAgentFlows, IJobExecutionState, INodeMetadata } from '../models/flows.model';
import { Connection, DynamicNode, Edge, VflowComponent } from 'ngx-vflow';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards'; // Added
import { ILlmTask } from '../../tasks/models/tasks-models'; // Corrected path
import { JobService } from '../../jobs/outcome-jobs.service';
import { IAssetNodeData } from '../models/nodes.model';
import { IGeneratedAsset } from '@dataclouder/ngx-ai-services';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { IAgentSource } from '../../sources/models/sources.model';
// NOt able to set a type for data yet.

export type DynamicNodeWithData = DynamicNode & { data?: any; category: 'input' | 'output' | 'process' | 'other'; component: string };
// 🥕 NOTE: Looks like this service is now a pure wraper, remove it soon.
@Injectable({
  providedIn: 'root',
})
export class FlowDiagramStateService {
  private jobService = inject(JobService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  private toastService = inject(TOAST_ALERTS_TOKEN);
  public vflowComponent!: VflowComponent;

  public setVflowComponent(vflowComponent: VflowComponent) {
    this.vflowComponent = vflowComponent;
  }
  public getFlow() {
    return this.flowSignalNodeStateService.flow();
  }

  public addNodeToCanvas(node: DynamicNodeWithData) {
    this.flowSignalNodeStateService.addNodeToCanvas(node);
  }

  public setFlow(flow: IAgentFlows) {
    this.flowSignalNodeStateService.flow.set(flow);
  }

  // Moved and refactored methods from FlowsComponent
  public deleteEdge(edge: Edge): void {
    this.flowSignalNodeStateService.deleteEdge(edge);
  }

  public addAgentToFlow(agentCard: IAgentCard): void {
    this.flowSignalNodeStateService.addAgentToFlow(agentCard);
  }

  public async addOutcomeToFlow(jobExecution: IJobExecutionState) {
    // output id es jobOutcome en database, el cual ya se que puede tener agentCard
    const outcomeJob = await this.jobService.getOutcomeJob(jobExecution.outputEntityId);
    // jobExecution.outputNodeId es el nuevo job Intenta buscar si ya existe un node para poblarlo con el job
    if (jobExecution.outputNodeId) {
      const node = this.flowSignalNodeStateService.nodes().find(node => node.id === jobExecution.outputNodeId);
      if (node) {
        node.data.nodeData = outcomeJob;
        // Just change one property so keep the rest of the node data
        this.flowSignalNodeStateService.updateNodeData(jobExecution.outputNodeId, node.data);
      }
    } else {
      this.toastService.success({ title: 'Terminó una tarea', subtitle: 'Se creará un nuevo nodo de salida' });

      this.flowSignalNodeStateService.addOutcomeToFlowConnected(outcomeJob, jobExecution.inputNodeId, jobExecution.processNodeId);
    }
    let outcomeJobNode;

    console.log('outcomeJobNode', outcomeJobNode);
  }

  // public updateNodeData(nodeId: string, data: INodeMetadata) {
  //   this.flowSignalNodeStateService.updateNodeData(nodeId, data);
  // }

  public findOutcomeNodeByAgentCardId(agentCardId: string): DynamicNodeWithData | undefined {
    return this.flowSignalNodeStateService.findOutcomeNodeByAgentCardId(agentCardId);
  }

  public createConnectionInputToProcessNode(inputNode: DynamicNodeWithData, processNode: DynamicNodeWithData): void {
    this.flowSignalNodeStateService.createConnectionInputToProcessNode(inputNode, processNode);
  }

  public addDistributionNode() {
    this.flowSignalNodeStateService.addDistributionNode();
  }

  public createConnectedAssetGeneratedNode(generatedAsset: IGeneratedAsset, inputNodeId: string, processNodeId: string) {
    this.flowSignalNodeStateService.createConnectedAssetGeneratedNode(generatedAsset, inputNodeId, processNodeId);
  }
}
