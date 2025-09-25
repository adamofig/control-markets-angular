import { inject, Injectable } from '@angular/core';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';
import { DynamicNodeWithData } from './flow-diagram-state.service';

@Injectable({
  providedIn: 'root',
})
export class NodeSearchesService {
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  public getInputs(nodeId: string): string[] {
    const edgesWhereTargetIsNode = this.flowSignalNodeStateService.edges().filter(edge => edge.target === nodeId);
    return edgesWhereTargetIsNode.map(edge => edge.source);
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
}
