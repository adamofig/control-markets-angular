import { computed, inject, Injectable, signal, Type } from '@angular/core';
import { IAgentFlows, IJobExecutionState, NodeType } from '../models/flows.model';
import { Connection, CustomNodeComponent, DynamicNode, Edge } from 'ngx-vflow';
import { IAgentCard } from '@dataclouder/ngx-agent-cards'; // Added
import { IAgentTask } from '../../tasks/models/tasks-models'; // Corrected path
import { nanoid } from 'nanoid'; // Added
import { AgentNodeComponent, DistributionChanelNodeComponent, OutcomeNodeComponent, SourcesNodeComponent, TaskNodeComponent } from '../nodes';
import { JobService } from '../../jobs/jobs.service';
import { IAgentOutcomeJob } from '../../jobs/models/jobs.model';
import { FlowComponentRefStateService } from './flow-component-ref-state.service';
import { IAgentSource } from '../../sources/models/sources.model';
import { AssetsNodeComponent } from '../nodes/assets-node/assets-node.component';
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';
import { IAssetNodeData } from '../models/nodes.model';
import { GeneratedAsset } from '@dataclouder/ngx-vertex';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';

export type DynamicNodeWithData = DynamicNode & { data?: any; category?: 'input' | 'output' | 'process' | 'other' };

//  This must have all the edges and node so i can go thoew every one.
@Injectable({
  providedIn: 'root',
})
export class FlowDiagramStateService {
  private jobService = inject(JobService);
  private flowComponentRefStateService = inject(FlowComponentRefStateService);

  private flow = signal<IAgentFlows | null>(null);

  public nodes = signal<DynamicNodeWithData[]>([]);
  public edges = signal<Edge[]>([]);

  public getFlow() {
    return this.flow();
  }

  public getInputs(nodeId: string): string[] {
    console.log('getTargetNodes', this.edges());

    const edgesWhereTargetIsNode = this.edges().filter(edge => edge.target === nodeId);
    const sourceIds = edgesWhereTargetIsNode.map(edge => edge.source);
    console.log('edgesWhereTargetIsNode', edgesWhereTargetIsNode);
    return sourceIds;
  }

  public addNodeToCanvas(node: DynamicNodeWithData) {
    this.nodes.set([...this.nodes(), node]);
  }

  public getInputNodes(nodeId: string): DynamicNodeWithData[] {
    const inputsIds = this.getInputs(nodeId);
    const allNodes = this.nodes();
    return allNodes.filter(node => inputsIds.includes(node.id));
  }

  public getOutputNodes(nodeId: string): DynamicNodeWithData[] {
    const edgesWhereSourceIsNode = this.edges().filter(edge => edge.source === nodeId);
    const targetIds = edgesWhereSourceIsNode.map(edge => edge.target);
    const allNodes = this.nodes();
    return allNodes.filter(node => targetIds.includes(node.id));
  }

  public setFlow(flow: IAgentFlows) {
    this.flow.set(flow);
  }

  // Moved and refactored methods from FlowsComponent
  public deleteEdge(edge: Edge): void {
    const currentEdges = this.edges().filter(e => e.id !== edge.id);
    this.edges.set(currentEdges);
  }

  public addAgentToFlow(agentCard: IAgentCard): void {
    this._createAgentNode(agentCard);
  }

  public async addOutcomeToFlow(outcome: IJobExecutionState) {
    const outcomeJob = await this.jobService.getJob(outcome.outputEntityId);
    let outcomeJobNode;
    if (outcome.nodeType === NodeType.AgentNodeComponent) {
      outcomeJobNode = this.findOutcomeNodeByAgentCardId(outcomeJob.agentCard?._id!);
    }

    if (!outcomeJobNode) {
      this.createConnectedOutcomeNode(outcomeJob);
    } else {
      this.flowComponentRefStateService.updateData(outcomeJobNode.id, { outcomeJob });
      this.updateNodeData(outcomeJobNode.id, { outcomeJob });
    }

    console.log('outcomeJobNode', outcomeJobNode);
  }

  public updateNodeData(nodeId: string, data: any) {
    this.nodes.update(nodes => nodes.map(node => (node.id === nodeId ? { ...node, data } : node)));
    //
    console.log('updateNodeData', this.nodes());
  }

  public findOutcomeNodeByAgentCardId(agentCardId: string): DynamicNodeWithData | undefined {
    return this.nodes().find(node => node?.data?.outcomeJob?.agentCard?._id === agentCardId);
  }

  public createConnectedOutcomeNode(outcomeJob: IAgentOutcomeJob, inputNodeId?: string, processNodeId?: string): void {
    // TODO: revisar que funcione esta tecnica.
    let inputNode;

    if (inputNodeId) {
      inputNode = this.nodes().find(node => node?.id === inputNodeId);
    }
    if (processNodeId) {
      inputNode = this.nodes().find(node => node?.id === processNodeId);
    }
    if (outcomeJob.agentCard) {
      inputNode = this.nodes().find(node => node?.data?.agentCard?._id === outcomeJob.agentCard?._id);
      console.log('inputNode', inputNode);
    } else {
      inputNode = this.nodes().find(node => node?.data?.agentTask?._id === outcomeJob.task?._id);
    }
    const taskNode = this.nodes().find(node => node?.data?.agentTask?._id === outcomeJob.task?._id);

    const x = taskNode?.point().x! + (taskNode?.point().x! - inputNode?.point().x!);
    const y = inputNode?.point().y! - 30;

    const newNode: DynamicNodeWithData = {
      id: 'outcome-node-' + nanoid(),
      point: signal({ x: x, y: y }), // Default position, can be made configurable
      type: OutcomeNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { outcomeJob }, // not writable for now, but if i change i need to change serializer.
      category: 'output',
    };

    this.nodes.set([...this.nodes(), newNode]);

    this._createEdge({ source: taskNode?.id!, target: newNode.id });
  }

  public addVideoGenNode() {
    const newNode: DynamicNodeWithData = {
      id: 'video-gen-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: VideoGenNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      category: 'process',
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addTaskToFlow(task: IAgentTask): void {
    this._createTaskNode(task);
  }

  private _createAgentNode(agentCard: IAgentCard): void {
    const newNode: DynamicNodeWithData = {
      id: 'agent-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position, can be made configurable
      type: AgentNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      category: 'input',
      data: { nodeData: agentCard } as any,
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  private _createTaskNode(task: IAgentTask): void {
    const newNode: DynamicNodeWithData = {
      id: 'task-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: TaskNodeComponent as Type<any>, // Ensure Type<any> is appropriate
      category: 'process',
      data: { nodeData: task } as any,
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addAssetNode(asset: IAssetNodeData): void {
    this._createAssetNode(asset);
  }

  private _createAssetNode(asset: IAssetNodeData): void {
    const newNode: DynamicNodeWithData = {
      id: 'asset-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: AssetsNodeComponent as Type<any>, // Ensure Type<any> is appropriate
      category: 'input',
      data: { nodeData: asset },
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public removeNode(nodeId: string): void {
    // Remove the node itself
    const currentNodes = this.nodes().filter(node => node.id !== nodeId);
    this.nodes.set(currentNodes);

    // Remove any edges connected to this node
    const currentEdges = this.edges().filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    this.edges.set(currentEdges);
  }

  public createEdge({ source, target }: Connection) {
    const inputNode = this.nodes().find(node => node.id === source);
    const outputNode = this.nodes().find(node => node.id === target);

    // Si esto ocurre signfica que Input y Output es de tipo Process por lo que generan un nodo typo Output Node
    //_______ __________ ____________
    if ((inputNode?.type as any)?.name === AgentNodeComponent.name) {
      if ((outputNode?.type as any)?.name === TaskNodeComponent.name) {
        const outcomeJobEmpty: Partial<IAgentOutcomeJob> = {
          agentCard: inputNode?.data?.agentCard,
          task: outputNode?.data?.agentTask,
        };
        this.createConnectedOutcomeNode(outcomeJobEmpty as IAgentOutcomeJob);
      }
    }

    if ((inputNode?.type as any)?.name === AssetsNodeComponent.name) {
      if ((outputNode?.type as any)?.name === VideoGenNodeComponent.name) {
        const generatedAssetEmpty: Partial<GeneratedAsset> = {};
        this.createConnectedAssetGeneratedNode(generatedAssetEmpty as GeneratedAsset, inputNode?.id!, outputNode?.id!);
      }
    }
    //_______ __________ ____________

    this._createEdge({ source, target });
  }

  private _createEdge({ source, target }: Connection) {
    const edges = [
      ...this.edges(),
      {
        id: `${source} -> ${target}`,
        source,
        target,
        markers: {
          end: {
            type: 'arrow',
          },
        },
        edgeLabels: {
          start: {
            type: 'html-template',
            data: { color: '#122c26' },
          },
        },
      },
    ];

    this.edges.set(edges as Edge[]);
  }

  public addDistributionNode() {
    const newNode: DynamicNodeWithData = {
      id: 'agent-node-' + nanoid(),
      point: signal({ x: 300, y: 100 }), // Default position, can be made configurable
      type: DistributionChanelNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addSourceNode(content?: string) {
    const source: Partial<IAgentSource> = {
      content: content || '',
    };
    const newNode: DynamicNodeWithData = {
      id: 'source-node-' + nanoid(), // Changed prefix for clarity
      point: signal({ x: 500, y: 100 }), // Default position, can be made configurable
      type: SourcesNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { agentSource: source }, // Pass initial data
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public createConnectedAssetGeneratedNode(generatedAsset: GeneratedAsset, inputNodeId: string, processNodeId: string) {
    const inputNode = this.nodes().find(node => node?.id === inputNodeId);
    const processNode = this.nodes().find(node => node?.id === processNodeId);
    const x = processNode?.point().x! + (processNode?.point().x! - inputNode?.point().x!);
    const y = processNode?.point().y! + (processNode?.point().y! - inputNode?.point().y!);
    console.log('x', x);
    console.log('y', y);
    const newNode: DynamicNodeWithData = {
      id: 'asset-generated-node-' + nanoid(),
      point: signal({ x: x, y: y }), // Default position
      type: AssetGeneratedNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      category: 'output',
      data: { nodeData: generatedAsset, inputNodeId, processNodeId },
    };
    this.nodes.set([...this.nodes(), newNode]);

    this._createEdge({ source: processNode?.id!, target: newNode.id });
  }
}
