import { Injectable, Type, inject, signal } from '@angular/core';
import { DynamicNode } from 'ngx-vflow';
import { AgentNodeComponent, DistributionChanelNodeComponent, OutcomeNodeComponent, SourcesNodeComponent, TaskNodeComponent } from '../nodes';
import { DynamicNodeWithData, FlowDiagramStateService } from './flow-diagram-state.service';
import { AssetsNodeComponent } from '../nodes/assets-node/assets-node.component';
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';
import { AssetGeneratedNodeComponent } from '../nodes/asset-generated-node/asset-generated-node';
import { FlowComponentRefStateService } from './flow-component-ref-state.service';
import { AudioTTsNodeComponent } from '../nodes/audio-tts-node/audio-tts-node';

// Node Type Mapping
function getNodeTypeMap(): { [key: string]: Type<any> | 'default' } {
  return {
    AgentNodeComponent: AgentNodeComponent,
    DistributionChanelNodeComponent: DistributionChanelNodeComponent,
    OutcomeNodeComponent: OutcomeNodeComponent,
    TaskNodeComponent: TaskNodeComponent,
    SourcesNodeComponent: SourcesNodeComponent,
    AssetsNodeComponent: AssetsNodeComponent,
    VideoGenNodeComponent: VideoGenNodeComponent,
    AssetGeneratedNodeComponent: AssetGeneratedNodeComponent,
    AudioTTsNodeComponent: AudioTTsNodeComponent,
    default: 'default',
  };
}

function getNodeTypeString(type: Type<any> | 'default' | undefined): string {
  if (typeof type === 'string') {
    return type;
  }
  const nodeTypeMap = getNodeTypeMap();
  for (const key in nodeTypeMap) {
    if (nodeTypeMap[key] === type) {
      return key;
    }
  }
  console.error('Unknown node type during serialization:', type);
  throw new Error(`Unknown node type: ${type ? (type as any).name : type}`);
}

function getNodeComponentFromString(typeString: string): Type<any> | 'default' {
  const nodeTypeMap = getNodeTypeMap();
  const component = nodeTypeMap[typeString];
  if (!component) {
    const error = `Unknown node during deserialization: if ${typeString} is a new Node, add it to the nodeTypeMap in flow-serialization.service.ts`;
    console.error(error);
    throw new Error(error);
  }
  return component;
}

@Injectable({
  providedIn: 'root',
})
export class FlowSerializationService {
  public flowComponentRefStateService = inject(FlowComponentRefStateService);

  public serializeFlow(flowDiagramStateService: FlowDiagramStateService): { nodes: any[]; edges: any[] } {
    const serializableNodes = flowDiagramStateService.nodes().map((node: any) => {
      const plainPoint = node.point();
      let serializableText: string | undefined;
      let serializableData: any | undefined;

      if (node.type === 'default') {
        if (node.text && typeof node.text === 'function') {
          serializableText = node.text();
        }
      }
      if (node.component === 'VideoGenNodeComponent') {
        debugger;

        const videoGenNode = this.flowComponentRefStateService.getNodeComponentRef(node.id);
        const prompt = (videoGenNode as any)?.prompt;

        const request = (videoGenNode as any)?.form.value;
        console.log('videoGenNode', prompt);
        const nodeData = { ...(node?.data?.nodeData || {}), prompt, request };
        serializableData = { ...node?.data, nodeData };
        console.log('serializableData', serializableData);
      } else {
        serializableData = { ...node.data };
      }

      // 🛑 Adding new attibutes must change loadFlow() and serializeFlow()

      const serializableNode: any = {
        id: node.id,
        point: plainPoint,
        type: getNodeTypeString(node.type as Type<any> | 'default'),
        category: node.category,
        component: node.component,
        data: {},
      };

      if (serializableText !== undefined) {
        serializableNode.text = serializableText;
      }
      if (serializableData !== undefined) {
        serializableNode.data = serializableData;
      }

      return serializableNode;
    });

    const serializableEdges = flowDiagramStateService.edges().map(edge => ({ ...edge }));

    return {
      nodes: serializableNodes,
      edges: serializableEdges,
    };
  }

  public loadFlow(flowDiagramStateService: FlowDiagramStateService, savedFlowData: { nodes: any[]; edges: any[] }): void {
    if (!savedFlowData || !savedFlowData.nodes || !savedFlowData.edges) {
      console.error('Invalid data provided to loadFlow:', savedFlowData);
      return;
    }

    const nodes = savedFlowData.nodes.map((plainNode: any) => {
      const nodeType = getNodeComponentFromString(plainNode.type);
      let dynamicNode: DynamicNodeWithData;

      if (nodeType === 'default') {
        dynamicNode = {
          id: plainNode.id,
          point: signal(plainNode.point),
          type: 'default',
          text: signal(plainNode.text !== undefined ? plainNode.text : ''),
          category: 'other',
          component: plainNode.component,
        };
      } else {
        dynamicNode = {
          id: plainNode.id,
          point: signal(plainNode.point),
          type: nodeType as Type<any>,
          data: { ...plainNode.data },
          category: plainNode.category,
          component: plainNode.component,
        };
      }
      return dynamicNode;
    });

    flowDiagramStateService.nodes.set(nodes);
    flowDiagramStateService.edges.set(savedFlowData.edges.map((edge: any) => ({ ...edge })));
  }
}
