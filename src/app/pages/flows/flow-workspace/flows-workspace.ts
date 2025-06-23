import { ChangeDetectionStrategy, Component, ElementRef, inject, NgZone, OnInit, signal, Type, ViewChild } from '@angular/core';
import { Connection, DynamicNode, Edge, Vflow } from 'ngx-vflow';
import { AgentNodeComponent } from '../nodes/agent-node/agent-node.component';
import { DistributionChanelNodeComponent } from '../nodes/distribution-chanel-node/distribution-chanel-node.component';
import { OutcomeNodeComponent } from '../nodes/outcome-node/outcome-node.component';
import { TaskNodeComponent } from '../nodes/task-node/task-node.component';
import { DialogModule } from 'primeng/dialog';
import { AgentCardListComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { OnActionEvent, TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { IAgentFlows } from '../models/flows.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowService } from '../flows.service';
import { ButtonModule } from 'primeng/button';
// import { nanoid } from 'nanoid'; // Removed as it's now used in FlowDiagramStateService
import { DynamicNodeWithData, FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IAgentTask } from '../../tasks/models/tasks-models';
import { FlowExecutionStateService } from '../services/flow-execution-state.service';
import { IAgentJob } from '../../jobs/models/jobs.model';
import { SourcesNodeComponent } from '../nodes/sources-node/sources-node.component';

// Node Type Mapping
const NODE_TYPE_MAP: { [key: string]: Type<any> | 'default' } = {
  // Using Type<any> for now
  AgentNodeComponent: AgentNodeComponent,
  DistributionChanelNodeComponent: DistributionChanelNodeComponent,
  OutcomeNodeComponent: OutcomeNodeComponent,
  TaskNodeComponent: TaskNodeComponent,
  SourcesNodeComponent: SourcesNodeComponent,
  default: 'default',
};

function getNodeTypeString(type: Type<any> | 'default' | undefined): string {
  if (typeof type === 'string') {
    // Handles 'default'
    return type;
  }
  for (const key in NODE_TYPE_MAP) {
    if (NODE_TYPE_MAP[key] === type) {
      return key;
    }
  }
  console.error('Unknown node type during serialization:', type);
  throw new Error(`Unknown node type: ${type ? (type as any).name : type}`);
}

function getNodeComponentFromString(typeString: string): Type<any> | 'default' {
  const component = NODE_TYPE_MAP[typeString];
  if (!component) {
    console.error('Unknown node type string during deserialization:', typeString);
    throw new Error(`Unknown node type string: ${typeString}`);
  }
  return component;
}

@Component({
  templateUrl: './flows-workspace.html',
  styleUrl: './flows-workspace.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Vflow, DialogModule, AgentCardListComponent, ButtonModule, TaskListComponent, InputTextModule, FormsModule],
})
export class FlowsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flowService = inject(FlowService);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public ngZone = inject(NgZone);
  public toastService = inject(TOAST_ALERTS_TOKEN);
  public flowExecutionStateService = inject(FlowExecutionStateService);

  public flowName = '';
  public isSavingFlow = signal(false);
  public isRunningFlow = signal(false);

  public isDialogVisible = false;

  public dialogs = { isAgentVisible: false, isTaskVisible: false };

  public backDots = {
    backgroundColor: 'transparent',
    color: '#f4fc0088',
    type: 'dots' as any,
    size: 1,
  };

  public flow: IAgentFlows | null = null;
  public flowId = this.route.snapshot.params['id'];
  public executionId = this.route.snapshot.params['executionId']; // Added outcomeId

  public flowExecutionState = this.flowExecutionStateService.getFlowExecutionStateSignal(); // Updated to use service signal

  @ViewChild('sourceFileInput') sourceFileInput!: ElementRef<HTMLInputElement>;

  async ngOnInit(): Promise<void> {
    if (this.flowId) {
      this.flow = await this.flowService.getFlow(this.flowId);
      this.flowId = this.flow?._id;

      if (this.flow) {
        this.flowName = this.flow.name as string;
        this.flowDiagramStateService.setFlow(this.flow);
        this.loadFlow(this.flow as any);

        if (this.executionId) {
          console.log(`Flow loaded with executionId: ${this.executionId}`);

          this.flowExecutionStateService.initializeExecutionStateListener(this.executionId);
        }
      }
    } else {
      this.flow = {
        id: '',
      };
      this.flowService.saveFlow(this.flow).then(flow => {
        this.flowId = flow.id;
        this.router.navigate([this.flowId], { relativeTo: this.route });
        // Initialize listener for a specific execution ID, replace '68533d06437a99b8f96c4047' with dynamic ID if needed
        // Or perhaps initialize when a new flow is created and an execution starts
        // For now, assuming a default or known execution ID
        // this.flowExecutionStateService.initializeExecutionStateListener('68545a7ad91f3bbf9369ed29');
      });
    }
  }

  public showAgents() {
    this.isDialogVisible = true;
  }

  public createEdge({ source, target }: Connection) {
    // search node.

    // Check if new edge is from agent to task
    const sourceNode = this.flowDiagramStateService.nodes().find(node => node.id === source);
    const targetNode = this.flowDiagramStateService.nodes().find(node => node.id === target);

    console.log('sourceNode', AgentNodeComponent.name, 'real node', (sourceNode?.type as any)?.name);

    if ((sourceNode?.type as any)?.name === AgentNodeComponent.name) {
      if ((targetNode?.type as any)?.name === TaskNodeComponent.name) {
        console.log('Agent to Task means connection from agent to task just happended');

        const outcomeJobEmpty: Partial<IAgentJob> = {
          agentCard: sourceNode?.data?.agentCard,
          task: targetNode?.data?.agentTask,
        };
        this.flowDiagramStateService.createOutcomeNode(outcomeJobEmpty as IAgentJob);
      }
    }

    const edges = [
      ...this.flowDiagramStateService.edges(),
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

    this.flowDiagramStateService.edges.set(edges as Edge[]);
  }

  deleteEdge(edge: Edge) {
    this.flowDiagramStateService.deleteEdge(edge);
  }

  addAgentToFlow(event: OnActionEvent): void {
    const card: IAgentCard = event.item;
    this.flowDiagramStateService.addAgentToFlow(card);
    this.isDialogVisible = false;
  }

  addTaskToFlow(event: OnActionEvent) {
    console.log('addTaskToFlow', event);
    const task: IAgentTask = event.item;
    this.flowDiagramStateService.addTaskToFlow(task);

    this.isDialogVisible = false;
  }

  public async saveFlow() {
    this.isSavingFlow.set(true);
    try {
      const flowData = this.serializeFlow();

      console.log('Flow saved:', flowData);
      const flow: IAgentFlows = {
        id: this.flowId,
        name: this.flowName,
        nodes: flowData.nodes,
        edges: flowData.edges,
      };
      const response = await this.flowService.saveFlow(flow);
      this.toastService.success({
        title: 'Flow saved successfully',
        subtitle: 'Flow saved successfully',
      });
      console.log('Flow saved:', response);
    } catch (error) {
      console.error('Error saving flow:', error);
      this.toastService.error({
        title: 'Error saving flow',
        subtitle: 'An error occurred while saving the flow.',
      });
    } finally {
      this.isSavingFlow.set(false);
    }
  }

  public serializeFlow(): { nodes: any[]; edges: any[] } {
    const serializableNodes = this.flowDiagramStateService.nodes().map(node => {
      const plainPoint = node.point();
      let serializableText: string | undefined;
      let serializableData: any | undefined;

      const nodeAsAny = node as any; // To access properties not strictly on the base DynamicNode

      if (node.type === 'default') {
        // This is a DefaultDynamicNode
        if (nodeAsAny.text && typeof nodeAsAny.text === 'function') {
          serializableText = nodeAsAny.text();
        }
      } else {
        // This is a ComponentDynamicNode or HtmlTemplateDynamicNode
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

    const serializableEdges = this.flowDiagramStateService.edges().map(edge => ({ ...edge }));

    console.log('Saving flow:', { nodes: serializableNodes, edges: serializableEdges });
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
        // For ComponentDynamicNode or HtmlTemplateDynamicNode
        dynamicNode = {
          id: plainNode.id,
          point: signal(plainNode.point),
          type: nodeType as Type<any>, // Cast to specific type
          data: { ...plainNode.data },
        };
      }
      return dynamicNode;
    });

    this.flowDiagramStateService.nodes.set(nodes);

    this.flowDiagramStateService.edges.set(savedFlowData.edges.map((edge: any) => ({ ...edge })));

    console.log('Flow loaded:', this.flowDiagramStateService.getFlow()?.nodes, this.flowDiagramStateService.getFlow()?.edges);
  }

  public showDialog(key: string) {
    // this.isDialogVisible = true;
    this.dialogs.isAgentVisible = false;
    this.dialogs.isTaskVisible = false;

    (this.dialogs as any)[key] = true;

    console.log(this.dialogs);

    this.isDialogVisible = true;
  }

  public showSelection() {}

  public async runFlow() {
    this.isRunningFlow.set(true);
    try {
      await this.saveFlow(); // It's good practice to save before running
      console.log('Flow running:', this.flowDiagramStateService.getFlow()?.nodes, this.flowDiagramStateService.getFlow()?.edges);
      const result: any = await this.flowService.runFlow(this.flowId || this.flow?.id || '');
      console.log('Flow result:', result);
      if (result && result.executionId) {
        this.flowExecutionStateService.initializeExecutionStateListener(result.executionId);
      } else {
        console.warn('Execution ID not found in runFlow response.');
        this.toastService.warn({
          title: 'Run Flow Warning',
          subtitle: 'Could not initialize execution listener, execution ID missing.',
        });
      }
    } catch (error) {
      console.error('Error running flow:', error);
      this.toastService.error({
        title: 'Error Running Flow',
        subtitle: 'An error occurred while trying to run the flow.',
      });
    } finally {
      this.isRunningFlow.set(false);
    }
  }

  public addDistributionNode() {
    this.flowDiagramStateService.addDistributionNode();
  }

  public addSourceNode(): void {
    // Trigger the hidden file input
    this.sourceFileInput.nativeElement.click();
  }

  public onSourceFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const markdownContent = e.target?.result as string;

          this.flowDiagramStateService.addSourceNode(markdownContent);
          console.log('New source node added with markdown content from file:', file.name);
          // Reset file input to allow selecting the same file again if needed
          if (this.sourceFileInput) {
            this.sourceFileInput.nativeElement.value = '';
          }
        };
        reader.onerror = e => {
          console.error('Error reading file:', e);
          // Reset file input
          if (this.sourceFileInput) {
            this.sourceFileInput.nativeElement.value = '';
          }
        };
        reader.readAsText(file);
      } else {
        console.warn('Please select a Markdown (.md) file.');
        this.toastService.info({ title: 'Invalid File', subtitle: 'Please select a Markdown (.md) file.' }); // Changed to info
        // Reset file input
        if (this.sourceFileInput) {
          this.sourceFileInput.nativeElement.value = '';
        }
      }
    }
  }
}
