import { Injectable, Type, inject, signal } from '@angular/core';
import { DynamicNodeWithData } from './flow-diagram-state.service';
import { FlowComponentRefStateService } from './flow-component-ref-state.service';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';
import { FlowNodeRegisterService } from './flow-node-register.service';

@Injectable({
  providedIn: 'root',
})
export class FlowSerializationService {
  public flowComponentRefStateService = inject(FlowComponentRefStateService);
  public flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  public flowNodeRegisterService = inject(FlowNodeRegisterService);

  public serializeFlow(): { nodes: any[]; edges: any[] } {
    const serializableNodes = this.flowSignalNodeStateService.nodes().map((node: any) => {
      const plainPoint = node.point();
      let serializableText: string | undefined;
      let serializableData: any | undefined;

      if (node.type === 'default') {
        if (node.text && typeof node.text === 'function') {
          serializableText = node.text();
        }
      } else if (node.component === 'AudioTTsNodeComponent') {
        const audioTTsNode = this.flowComponentRefStateService.getNodeComponentRef(node.id);
        const value = (audioTTsNode as any)?.value;
        const settings = { ...(audioTTsNode as any)?.settings() };
        // Temporal, settings should be consistent storagePath should save in settings but i have instead storage.path
        // settings['storagePath'] = (audioTTsNode as any)?.storagePath || settings.storage.path;
        const nodeData = { ...(node?.data?.nodeData || {}), value, settings };
        serializableData = { ...node?.data, nodeData };
      } else {
        serializableData = { ...node.data };
      }

      // 🛑 Adding new attibutes must change loadFlow() and serializeFlow()

      const serializableNode: any = {
        id: node.id,
        point: plainPoint,
        type: this.flowNodeRegisterService.getNodeTypeString(node.type as Type<any>),
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

    const serializableEdges = this.flowSignalNodeStateService.edges().map(edge => ({ ...edge }));

    return {
      nodes: serializableNodes,
      edges: serializableEdges,
    };
  }

  public loadFlow(savedFlowData: { nodes: any[]; edges: any[] }): void {
    if (!savedFlowData || !savedFlowData.nodes || !savedFlowData.edges) {
      console.error('Invalid data provided to loadFlow:', savedFlowData);
      return;
    }

    const nodes = savedFlowData.nodes.map((plainNode: any) => {
      const nodeType = this.flowNodeRegisterService.getNodeType(plainNode.type || plainNode.component);
      let dynamicNode: DynamicNodeWithData;

      if (nodeType === undefined) {
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

    this.flowSignalNodeStateService.nodes.set(nodes);
    this.flowSignalNodeStateService.edges.set(savedFlowData.edges.map((edge: any) => ({ ...edge })));
  }
}
