import { inject, Injectable, signal, Type } from '@angular/core';
import { IAgentFlows, IJobExecutionState } from '../models/flows.model';
import { Connection, DynamicNode, Edge } from 'ngx-vflow';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';
import { IAgentCard } from '@dataclouder/ngx-agent-cards'; // Added
import { IAgentTask } from '../../tasks/models/tasks-models'; // Corrected path
import { nanoid } from 'nanoid'; // Added
import { AgentNodeComponent, DistributionChanelNodeComponent, OutcomeNodeComponent, SourcesNodeComponent, TaskNodeComponent } from '../nodes';
import { JobService } from '../../jobs/jobs.service';
import { FlowComponentRefStateService } from './flow-component-ref-state.service';
import { IAgentSource } from '../../sources/models/sources.model';
import { AssetsNodeComponent } from '../nodes/assets-node/assets-node.component';
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';
import { IAssetNodeData } from '../models/nodes.model';
import { GeneratedAsset } from '@dataclouder/ngx-vertex';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';

export type DynamicNodeWithData = DynamicNode & { data?: any; category?: 'input' | 'output' | 'process' | 'other'; component?: string };

@Injectable({
  providedIn: 'root',
})
export class FlowDiagramStateService {
  private jobService = inject(JobService);
  private flowComponentRefStateService = inject(FlowComponentRefStateService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);

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
    console.log('getTargetNodes', this.flowSignalNodeStateService.edges());

    const edgesWhereTargetIsNode = this.flowSignalNodeStateService.edges().filter(edge => edge.target === nodeId);
    const sourceIds = edgesWhereTargetIsNode.map(edge => edge.source);
    console.log('edgesWhereTargetIsNode', edgesWhereTargetIsNode);
    return sourceIds;
  }

  public addNodeToCanvas(node: DynamicNodeWithData) {
    this.flowSignalNodeStateService.addNodeToCanvas(node);
  }

  public getInputNodes(nodeId: string): DynamicNodeWithData[] {
    const inputsIds = this.getInputs(nodeId);
    const allNodes = this.flowSignalNodeStateService.nodes();
    return allNodes.filter(node => inputsIds.includes(node.id));
  }

  public getOutputNodes(nodeId: string): DynamicNodeWithData[] {
    const edgesWhereSourceIsNode = this.flowSignalNodeStateService.edges().filter(edge => edge.source === nodeId);
    const targetIds = edgesWhereSourceIsNode.map(edge => edge.target);
    const allNodes = this.flowSignalNodeStateService.nodes();
    return allNodes.filter(node => targetIds.includes(node.id));
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
    const outcomeJob = await this.jobService.getJob(jobExecution.outputEntityId);
    // Intenta buscar si ya existe un node para poblarlo con el job
    if (jobExecution.outputNodeId) {
      const node = this.flowSignalNodeStateService.nodes().find(node => node.id === jobExecution.outputNodeId);
      if (node) {
        node.data.nodeData = outcomeJob;
        // Just change one property so keep the rest of the node data
        this.flowSignalNodeStateService.updateNodeData(jobExecution.outputNodeId, node.data);
      }
    } else {
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

  public createConnectedAssetGeneratedNode(generatedAsset: GeneratedAsset, inputNodeId: string, processNodeId: string) {
    this.flowSignalNodeStateService.createConnectedAssetGeneratedNode(generatedAsset, inputNodeId, processNodeId);
  }
}
