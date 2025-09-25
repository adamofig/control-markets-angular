import { inject, Injectable, signal, Type } from '@angular/core';
import { IAgentFlows, IJobExecutionState } from '../models/flows.model';
import { Connection, DynamicNode, Edge } from 'ngx-vflow';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards'; // Added
import { IAgentTask } from '../../tasks/models/tasks-models'; // Corrected path
import { JobService } from '../../jobs/outcome-jobs.service';
import { FlowComponentRefStateService } from './flow-component-ref-state.service';
import { IAssetNodeData } from '../models/nodes.model';
import { IGeneratedAsset } from '@dataclouder/ngx-vertex';
import { NodeSearchesService } from './node-searches.service';

// NOt able to set a type for data yet.
export interface NodeData {
  nodeData?: any;
  inputNodeId?: string;
  processNodeId?: string;
}

export type DynamicNodeWithData = DynamicNode & { data?: any; category: 'input' | 'output' | 'process' | 'other'; component: string };

@Injectable({
  providedIn: 'root',
})
export class FlowDiagramStateService {
  private jobService = inject(JobService);
  private flowComponentRefStateService = inject(FlowComponentRefStateService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  private nodeSearchesService = inject(NodeSearchesService);

  public get nodes() {
    return this.flowSignalNodeStateService.nodes;
  }

  public get edges() {
    return this.flowSignalNodeStateService.edges;
  }

  public getFlow() {
    return this.flowSignalNodeStateService.flow();
  }

  public getInputs(nodeId: string): string[] {
    return this.nodeSearchesService.getInputs(nodeId);
  }

  public addNodeToCanvas(node: DynamicNodeWithData) {
    this.flowSignalNodeStateService.addNodeToCanvas(node);
  }

  public getInputNodes(nodeId: string): DynamicNodeWithData[] {
    return this.nodeSearchesService.getInputNodes(nodeId);
  }

  public getOutputNodes(nodeId: string): DynamicNodeWithData[] {
    return this.nodeSearchesService.getOutputNodes(nodeId);
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
      this.flowSignalNodeStateService.addOutcomeToFlowConnected(outcomeJob, jobExecution.inputNodeId, jobExecution.processNodeId);
      alert('El nodo output no exite, tengo que buscarlo... ');
    }
    let outcomeJobNode;

    console.log('outcomeJobNode', outcomeJobNode);
  }

  public updateNodeData(nodeId: string, data: any) {
    this.flowSignalNodeStateService.updateNodeData(nodeId, data);
  }

  public findOutcomeNodeByAgentCardId(agentCardId: string): DynamicNodeWithData | undefined {
    return this.flowSignalNodeStateService.findOutcomeNodeByAgentCardId(agentCardId);
  }

  public createConnectionInputToProcessNode(inputNode: DynamicNodeWithData, processNode: DynamicNodeWithData): void {
    this.flowSignalNodeStateService.createConnectionInputToProcessNode(inputNode, processNode);
  }

  public addAudioTTSGenNode() {
    this.flowSignalNodeStateService.addAudioTTSNode();
  }

  public addVideoGenNode() {
    this.flowSignalNodeStateService.addVideoGenNode();
  }

  public addTaskToFlow(task: IAgentTask): void {
    this.flowSignalNodeStateService.addTaskToFlow(task);
  }

  public addAssetNode(asset: IAssetNodeData): void {
    this.flowSignalNodeStateService.addAssetNode(asset);
  }

  public removeNode(nodeId: string): void {
    this.flowSignalNodeStateService.removeNode(nodeId);
  }

  public createEdge({ source, target }: Connection) {
    this.flowSignalNodeStateService.createEdge({ source, target });
  }

  public addDistributionNode() {
    this.flowSignalNodeStateService.addDistributionNode();
  }

  public addSourceNode(content?: string) {
    this.flowSignalNodeStateService.addSourceNode(content);
  }

  public createConnectedAssetGeneratedNode(generatedAsset: IGeneratedAsset, inputNodeId: string, processNodeId: string) {
    this.flowSignalNodeStateService.createConnectedAssetGeneratedNode(generatedAsset, inputNodeId, processNodeId);
  }
}
