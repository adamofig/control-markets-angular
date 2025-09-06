import { Injectable, Type, signal } from '@angular/core';
import { DynamicNode } from 'ngx-vflow';
import { AgentNodeComponent, DistributionChanelNodeComponent, OutcomeNodeComponent, SourcesNodeComponent, TaskNodeComponent } from '../nodes';
import { DynamicNodeWithData, FlowDiagramStateService } from './flow-diagram-state.service';
import { AssetsNodeComponent } from '../nodes/assetsNode/assets-node.component';
import { VideoGenNodeComponent } from '../nodes/video-gen-node/video-gen-node';

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
  public serializeFlow(flowDiagramStateService: FlowDiagramStateService): { nodes: any[]; edges: any[] } {
    const serializableNodes = flowDiagramStateService.nodes().map(node => {
      const plainPoint = node.point();
      let serializableText: string | undefined;
      let serializableData: any | undefined;

      const nodeAsAny = node as any;

      if (node.type === 'default') {
        if (nodeAsAny.text && typeof nodeAsAny.text === 'function') {
          serializableText = nodeAsAny.text();
        }
      } else {
        serializableData = { ...nodeAsAny.data };
      }

      const serializableNode: any = {
        id: node.id,
        point: plainPoint,
        type: getNodeTypeString(node.type as Type<any> | 'default'),
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
        };
      } else {
        dynamicNode = {
          id: plainNode.id,
          point: signal(plainNode.point),
          type: nodeType as Type<any>,
          data: { ...plainNode.data },
        };
      }
      return dynamicNode;
    });

    flowDiagramStateService.nodes.set(nodes);
    flowDiagramStateService.edges.set(savedFlowData.edges.map((edge: any) => ({ ...edge })));
  }
}
