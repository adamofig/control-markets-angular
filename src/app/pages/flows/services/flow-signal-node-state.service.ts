import { Injectable, signal, Type, inject } from '@angular/core';
import { ICreativeFlowBoard, NodeCompTypeStr, INodeMetadata, NodeCategory } from '../models/flows.model';
import { DynamicNodeWithData } from './flow-diagram-state.service';
import { Connection, Edge } from 'ngx-vflow';
import { nanoid } from 'nanoid';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { ILlmTask } from '../../tasks/models/tasks-models';
import { IAssetNodeData } from '../models/nodes.model';
import { IAgentSource } from '../../sources/models/sources.model';
import { IGeneratedAsset } from '@dataclouder/ngx-ai-services';
import { IAgentOutcomeJob } from '../../jobs/models/jobs.model';
import { FlowNodeRegisterService } from './flow-node-register.service';

@Injectable({
  providedIn: 'root',
})
export class FlowSignalNodeStateService {
  public flowNodeRegisterService = inject(FlowNodeRegisterService);
  public flow = signal<ICreativeFlowBoard | null>(null);
  public nodes = signal<DynamicNodeWithData[]>([]);
  public edges = signal<Edge[]>([]);

  public addNodeToCanvas(node: DynamicNodeWithData) {
    this.nodes.set([...this.nodes(), node]);
  }

  public deleteEdge(edge: Edge): void {
    const currentEdges = this.edges().filter(e => e.id !== edge.id);
    this.edges.set(currentEdges);
  }

  public addAgentToFlow(agentCard: IAgentCard): void {
    this._createAgentNode(agentCard);
  }

  public updateNodeData(nodeId: string, data: INodeMetadata) {
    this.nodes.update(nodes => nodes.map(node => (node.id === nodeId ? { ...node, data } : node)));
    //
    console.log('updateNodeData', this.nodes());
  }

  public findOutcomeNodeByAgentCardId(agentCardId: string): DynamicNodeWithData | undefined {
    return this.nodes().find(node => node?.data?.outcomeJob?.agentCard?._id === agentCardId);
  }

  public createConnectionInputToProcessNode(inputNode: DynamicNodeWithData, processNode: DynamicNodeWithData): void {
    if ((processNode.type as any)?.name === NodeCompTypeStr.TaskNodeComponent) {
      // 'Como es de tipo TaskNodeComponent, su salida tiene que ser outcome'
      const x = processNode?.point().x! + (processNode?.point().x! - inputNode?.point().x!);
      const y = inputNode?.point().y! - 30;
      // se calcula X y Y Se pone por default a la derecha.

      const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.OutcomeNodeComponent);
      if (!nodeConfig) return;

      const newNode: DynamicNodeWithData = {
        id: 'outcome-node-' + nanoid(),
        point: signal({ x: x, y: y }), // Default position, can be made configurable
        type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
        data: { nodeData: {}, inputNodeId: inputNode.id, processNodeId: processNode.id }, // not writable for now, but if i change i need to change serializer.
        config: {
          component: NodeCompTypeStr.OutcomeNodeComponent,
          category: NodeCategory.OUTPUT,
          color: nodeConfig.color,
          icon: nodeConfig.icon,
          label: nodeConfig.label
        }
      };

      this.nodes.set([...this.nodes(), newNode]);

      this._createEdge({ source: processNode?.id!, target: newNode.id });
    }
    console.log('creando nuevo nodo. ', inputNode, processNode);
  }

  public addVideoGenNode() {
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.VideoGenNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'video-gen-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      config: {
        component: NodeCompTypeStr.VideoGenNodeComponent,
        category: NodeCategory.PROCESS,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addVideoScriptGenNode() {
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.VideoScriptGenNodeComponent);
    const wrapperConfig = this.flowNodeRegisterService.getNodeConfig('WrapperNodeComponent');
    if (!nodeConfig || !wrapperConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'video-script-gen-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: wrapperConfig.component as Type<any>,
      data: { nodeData: { prompt: '', script: '' } } as any,
      config: {
        component: NodeCompTypeStr.VideoScriptGenNodeComponent,
        category: NodeCategory.PROCESS,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addOutcomeToFlowConnected(outcomeJob: IAgentOutcomeJob, inputNodeId: string, processNodeId: string) {
    const inputNode = this.nodes().find(node => node?.id === inputNodeId);
    const processNode = this.nodes().find(node => node?.id === processNodeId);
    const x = processNode?.point().x! + (processNode?.point().x! - inputNode?.point().x!);
    const y = processNode?.point().y! + (processNode?.point().y! - inputNode?.point().y!);
    console.log('x', x);
    console.log('y', y);
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.OutcomeNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'asset-generated-node-' + nanoid(),
      point: signal({ x: x, y: y }), // Default position
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { nodeData: outcomeJob, inputNodeId, processNodeId },
      config: {
        component: NodeCompTypeStr.OutcomeNodeComponent,
        category: NodeCategory.OUTPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);

    this._createEdge({ source: processNode?.id!, target: newNode.id });
  }

  public addOutcomeToFlow(outcomeJob: IAgentOutcomeJob) {
    // El output usalmente debe estar conectado con su task y su input, aqui no crea ni conection ni agrega los datos para que los encuentre.
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.OutcomeNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'outcome-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position, can be made configurable
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { nodeData: outcomeJob }, // not writable for now, but if i change i need to change serializer.
      config: {
        component: NodeCompTypeStr.OutcomeNodeComponent,
        category: NodeCategory.OUTPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addTaskToFlow(task: ILlmTask): void {
    this._createTaskNode(task);
  }

  private _createAgentNode(agentCard: IAgentCard): void {
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AgentNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'agent-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position, can be made configurable
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { nodeData: agentCard } as any,
      config: {
        component: NodeCompTypeStr.AgentNodeComponent,
        category: NodeCategory.INPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  private _createTaskNode(task: ILlmTask): void {
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.TaskNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'task-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate
      data: { nodeData: task } as any,
      config: {
        component: NodeCompTypeStr.TaskNodeComponent,
        category: NodeCategory.PROCESS,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addAssetNode(asset: IAssetNodeData, refNodeId?: string): void {
    this._createAssetNode(asset, refNodeId);
  }

  private _createAssetNode(asset: IAssetNodeData, refNodeId?: string): void {
    let x = 100;
    let y = 100;

    const randomAdd = Math.floor(Math.random() * 200);
    const yRandom = Math.random() > 0.5 ? randomAdd : -randomAdd;

    if (refNodeId) {
      const refNode = this.nodes().find(n => n.id === refNodeId);
      if (refNode) {
        const refPoint = refNode.point();
        x = refPoint.x + 250 + randomAdd; // Position to the right
        y = refPoint.y + yRandom;
      }
    }

    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AssetsNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'asset-node-' + nanoid(),
      point: signal({ x, y }), // Default position
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate
      data: { nodeData: asset },
      config: {
        component: NodeCompTypeStr.AssetsNodeComponent,
        category: NodeCategory.INPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }
  public addAudioNode(asset: IAssetNodeData, refNodeId?: string): void {
    this._createAudioNode(asset, refNodeId);
  }

  private _createAudioNode(asset: IAssetNodeData, refNodeId?: string): void {
    let x = 100;
    let y = 100;

    const randomAdd = Math.floor(Math.random() * 200);
    const yRandom = Math.random() > 0.5 ? randomAdd : -randomAdd;

    if (refNodeId) {
      const refNode = this.nodes().find(n => n.id === refNodeId);
      if (refNode) {
        const refPoint = refNode.point();
        x = refPoint.x + 250 + randomAdd; // Position to the right
        y = refPoint.y + yRandom;
      }
    }

    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AudioNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'audio-node-' + nanoid(),
      point: signal({ x, y }), // Default position
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate
      data: { nodeData: asset },
      config: {
        component: NodeCompTypeStr.AudioNodeComponent,
        category: NodeCategory.INPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
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
    if (inputNode?.config?.component === NodeCompTypeStr.AgentNodeComponent) {
      if (outputNode?.config?.component === NodeCompTypeStr.TaskNodeComponent) {
        this.createConnectionInputToProcessNode(inputNode!, outputNode!);
      }
    }

    if (inputNode?.config?.component === NodeCompTypeStr.AssetsNodeComponent) {
      if (outputNode?.config?.component === NodeCompTypeStr.VideoGenNodeComponent) {
        // ... (rest of logic can be added later if needed)
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
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.DistributionChanelNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'agent-node-' + nanoid(),
      point: signal({ x: 300, y: 100 }), // Default position, can be made configurable
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      config: {
        component: NodeCompTypeStr.DistributionChanelNodeComponent,
        category: NodeCategory.OUTPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addSourceNode(source?: Partial<IAgentSource>) {
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.SourcesNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'source-node-' + nanoid(), // Changed prefix for clarity
      point: signal({ x: 500, y: 100 }), // Default position, can be made configurable
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { nodeData: source }, // Pass initial data
      config: {
        component: NodeCompTypeStr.SourcesNodeComponent,
        category: NodeCategory.INPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public createConnectedAssetGeneratedNode(generatedAsset: IGeneratedAsset, inputNodeId: string, processNodeId: string) {
    const inputNode = this.nodes().find(node => node?.id === inputNodeId);
    const processNode = this.nodes().find(node => node?.id === processNodeId);
    const x = processNode?.point().x! + (processNode?.point().x! - inputNode?.point().x!);
    const y = processNode?.point().y! + (processNode?.point().y! - inputNode?.point().y!);
    console.log('x', x);
    console.log('y', y);
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(NodeCompTypeStr.AssetGeneratedNodeComponent);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'asset-generated-node-' + nanoid(),
      point: signal({ x: x, y: y }), // Default position
      type: nodeConfig.component as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: { nodeData: generatedAsset, inputNodeId, processNodeId },
      config: {
        component: NodeCompTypeStr.AssetGeneratedNodeComponent,
        category: NodeCategory.OUTPUT,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);

    this._createEdge({ source: processNode?.id!, target: newNode.id });
  }

  public addEmptyNode(nodeType: NodeCompTypeStr) {
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(nodeType);
    if (!nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: `${nodeType}-${nanoid()}`,
      point: signal({ x: 100, y: 100 }),
      type: nodeConfig.component as Type<any>,
      data: { nodeData: {} },
      config: {
        component: nodeType,
        category: nodeConfig.category,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  public addWrapperNode(component: string, inputs: any): void {
    // debugger
    const nodeConfig = this.flowNodeRegisterService.getNodeConfig(component);
    const wrapperConfig = this.flowNodeRegisterService.getNodeConfig('WrapperNodeComponent');
    if (!wrapperConfig || !nodeConfig) return;

    const newNode: DynamicNodeWithData = {
      id: 'wrapper-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }),
      type: wrapperConfig.component as Type<any>,
      data: {
        nodeData: inputs,
      },
      config: {
        component: component as NodeCompTypeStr,
        category: nodeConfig.category,
        color: nodeConfig.color,
        icon: nodeConfig.icon,
        label: nodeConfig.label
      }
    };
    this.nodes.set([...this.nodes(), newNode]);
  }
}
