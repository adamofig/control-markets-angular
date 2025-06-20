import { inject, Injectable, signal, Type } from '@angular/core';
import { IAgentFlows, IJobExecutionState } from '../models/flows.model';
import { Connection, DynamicNode, Edge } from 'ngx-vflow';
import { IAgentCard } from '@dataclouder/ngx-agent-cards'; // Added
import { IAgentTask } from '../../tasks/models/tasks-models'; // Corrected path
import { nanoid } from 'nanoid'; // Added
import { AgentNodeComponent } from '../nodes/agent-node/agent-node.component'; // Corrected path
import { TaskNodeComponent } from '../nodes/task-node/task-node.component'; // Corrected path
import { OutcomeNodeComponent } from '../nodes/outcome-node/outcome-node.component';
import { JobService } from '../../jobs/jobs.service';
import { IAgentJob } from '../../jobs/models/jobs.model';
import { DistributionChanelNodeComponent } from '../nodes/distribution-chanel-node/distribution-chanel-node.component';

export type DynamicNodeWithData = DynamicNode & { data?: any };

//  This must have all the edges and node so i can go thoew every one.
@Injectable({
  providedIn: 'root',
})
export class FlowDiagramStateService {
  private jobService = inject(JobService);

  private flow = signal<IAgentFlows | null>(null);

  public nodes = signal<DynamicNodeWithData[]>([]);
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

  public async addOutcomeToFlow(outcome: IJobExecutionState) {
    const outcomeJob = await this.jobService.getJob(outcome.outcomeId);
    this._createOutcomeNode(outcomeJob);
  }

  private _createOutcomeNode(outcomeJob: IAgentJob): void {
    debugger;

    outcomeJob.agentCard?._id;
    const agentNode = this.nodes().find(node => node?.data?.agentCard?._id === outcomeJob.agentCard?._id);
    const taskNode = this.nodes().find(node => node?.data?.agentTask?._id === outcomeJob.task?._id);

    debugger;
    console.log('agentNode', agentNode);
    const x = taskNode?.point().x! + (taskNode?.point().x! - agentNode?.point().x!);
    const y = agentNode?.point().y! - 30;

    const newNode: DynamicNodeWithData = {
      id: 'outcome-node-' + nanoid(),
      point: signal({ x: x, y: y }), // Default position, can be made configurable
      type: OutcomeNodeComponent as Type<any>, // Ensure Type<any> is appropriate or use specific type
      data: {
        outcomeJob: outcomeJob,
      }, // not writable for now, but if i change i need to change serializer.
    };
    this.nodes.set([...this.nodes(), newNode]);

    this.createEdge({ source: taskNode?.id!, target: newNode.id });
  }

  public addTaskToFlow(task: IAgentTask): void {
    this._createTaskNode(task);
  }

  private _createAgentNode(card: IAgentCard): void {
    const newNode: DynamicNodeWithData = {
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
    const newNode: DynamicNodeWithData = {
      id: 'task-node-' + nanoid(),
      point: signal({ x: 100, y: 100 }), // Default position
      type: TaskNodeComponent as Type<any>, // Ensure Type<any> is appropriate
      data: {
        agentTask: task,
      }, // not writable for now, but if i change i need to change serializer.
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

  private createEdge({ source, target }: Connection) {
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
}
