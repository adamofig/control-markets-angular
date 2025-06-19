import { Injectable, signal, Type } from '@angular/core';
import { IAgentFlows } from './models/flows.model';
import { DynamicNode, Edge } from 'ngx-vflow';
import { IAgentCard } from '@dataclouder/ngx-agent-cards'; // Added
import { IAgentTask } from '../tasks/models/tasks-models'; // Corrected path
import { nanoid } from 'nanoid'; // Added
import { AgentNodeComponent } from './agent-node/agent-node.component'; // Corrected path
import { TaskNodeComponent } from './task-node/task-node.component'; // Corrected path

//  This must have all the edges and node so i can go thoew every one.
@Injectable({
  providedIn: 'root',
})
export class FlowDiagramStateService {
  private flow = signal<IAgentFlows | null>(null);

  public nodes = signal<DynamicNode[]>([]);

  public edges = signal<Edge[]>([]);

  public getFlow() {
    return this.flow();
  }

  public getTargetNodesForSource(nodeId: string): string[] {
    console.log('getTargetNodes', this.edges());
    return this.edges()
      .filter(edge => edge.source === nodeId)
      .map(edge => edge.target);
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

  public addTaskToFlow(task: IAgentTask): void {
    this._createTaskNode(task);
  }

  private _createAgentNode(card: IAgentCard): void {
    const newNode: DynamicNode = {
      id: 'agent-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position, can be made configurable
      type: AgentNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: {
        agentCard: card,
      } as any,
    };
    this.nodes.set([...this.nodes(), newNode]);
  }

  private _createTaskNode(task: IAgentTask): void {
    const newNode: DynamicNode = {
      id: 'task-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: TaskNodeComponent as Type<any>, // Ensure Type<any> is appropriate
      data: {
        agentTask: task,
      } as any, // not writable for now, but if i change i need to change serializer.
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
}
