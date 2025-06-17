import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Type } from '@angular/core';
import { Connection, DynamicNode, Edge, Vflow } from 'ngx-vflow';
import { CircularNodeComponent, NodeData } from '../circular-node.component';
import { AgentNodeComponent } from '../agent-node/agent-node.component';
import { DistributionChanelNodeComponent } from '../distribution-chanel-node/distribution-chanel-node.component';
import { OutcomeNodeComponent } from '../outcome-node/outcome-node.component';
import { TaskNodeComponent } from '../task-node/task-node.component';
import { DialogModule } from 'primeng/dialog';
import { AgentCardListComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';
import { OnActionEvent } from '@dataclouder/ngx-core';
import { IFlow } from '../models/generics.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FlowService } from '../flows.service';
import { ButtonModule } from 'primeng/button';
import { nanoid } from 'nanoid';
import { FlowStateService } from '../flow-state.service';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';

// Node Type Mapping
const NODE_TYPE_MAP: { [key: string]: Type<any> | 'default' } = {
  // Using Type<any> for now
  AgentNodeComponent: AgentNodeComponent,
  DistributionChanelNodeComponent: DistributionChanelNodeComponent,
  OutcomeNodeComponent: OutcomeNodeComponent,
  TaskNodeComponent: TaskNodeComponent,
  CircularNodeComponent: CircularNodeComponent,
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
  templateUrl: './flows.component.html',
  styleUrl: './flows.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Vflow, DialogModule, AgentCardListComponent, ButtonModule, TaskListComponent],
})
export class FlowsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private flowService = inject(FlowService);
  public flowStateService = inject(FlowStateService);

  public isDialogVisible = false;

  public dialogs = {
    isAgentVisible: false,
    isTaskVisible: false,
  };

  public backDots = {
    backgroundColor: 'transparent',
    color: '#f4fc0088',
    type: 'dots' as any,
    size: 1,
  };

  public flow: IFlow | null = null;
  public flowId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.flowId) {
      this.flow = await this.flowService.getFlow(this.flowId);
      if (this.flow) {
        this.flowStateService.setFlow(this.flow);
        this.loadFlow(this.flow as any);
        // this.flowForm.patchValue(this.flow);
      }
    } else {
      this.flow = {
        id: '',
      };
      this.flowService.saveFlow(this.flow).then(flow => {
        this.flowId = flow.id;
        this.router.navigate([this.flowId], { relativeTo: this.route });
      });
    }
  }

  public showAgents() {
    this.isDialogVisible = true;
  }

  // public nodes: DynamicNode[] = [];
  // public edges: Edge[] = [];

  // = [
  //   {
  //     id: '3',
  //     point: signal({ x: 250, y: 250 }),
  //     type: 'default',
  //     text: signal('Default'),
  //   },

  //   {
  //     id: '4',
  //     point: signal({ x: 450, y: 450 }),
  //     type: AgentNodeComponent as any,
  //     data: {
  //       text: 'Circular Node',
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/niche-market-dev.firebasestorage.app/o/conversation-cards%2F67e1e0dba60280a761d75d8a%2Fnull-wtecyekgx8b.webp?alt=media&token=e6e2470e-bf5c-4a5f-9007-e508a3f359c2',
  //     } as any,
  //   },

  //   {
  //     id: '5',
  //     point: signal({ x: 150, y: 450 }),
  //     type: DistributionChanelNodeComponent as any,
  //     data: {
  //       text: 'Distribution Chanel Node',
  //       image: 'https://vleeko.net/wp-content/uploads/2014/10/blog.jpg',
  //     } as any,
  //   },

  //   {
  //     id: '6',
  //     point: signal({ x: 150, y: 350 }),
  //     type: OutcomeNodeComponent as any,
  //     data: {
  //       text: 'Outcome Node',
  //       image:
  //         'https://firebasestorage.googleapis.com/v0/b/niche-market-dev.firebasestorage.app/o/conversation-cards%2F67e1e0dba60280a761d75d8a%2Fnull-wtecyekgx8b.webp?alt=media&token=e6e2470e-bf5c-4a5f-9007-e508a3f359c2',
  //     } as any,
  //   },

  //   {
  //     id: '7',
  //     point: signal({ x: 550, y: 150 }),
  //     type: TaskNodeComponent as any,
  //     data: {
  //       text: 'Task Node',
  //       image:
  //         'https://www.monitask.com/wp-content/uploads/2024/02/master-your-task-management-%E2%80%A8how-the-1-3-5-rule-revolutionizes-%E2%80%A8to-do-lists.png',
  //     } as any,
  //   },
  // ];

  // public edges: Edge[] = [
  //   {
  //     id: '1 -> 2',
  //     source: '1',
  //     target: '2',
  //   },
  // ];

  public createEdge({ source, target }: Connection) {
    const edges = [
      ...this.flowStateService.edges(),
      {
        id: `${source} -> ${target}`,
        source,
        target,
        markers: {
          end: {
            type: 'arrow',
          },
        },
      },
    ];

    // this.flowStateService.edges.set(edges);
  }

  handleRelationSelection(event: OnActionEvent) {
    console.log('handleRelationSelection', event);

    const card: IAgentCard = event.item;
    this.createAgentNode(card);
    this.isDialogVisible = false;
  }

  public createAgentNode(card: IAgentCard) {
    const nodes = [
      ...this.flowStateService.nodes(),
      {
        id: nanoid(),
        point: signal({ x: 100, y: 100 }),
        type: AgentNodeComponent as any,
        data: {
          id: card.id || card._id,
          text: card.title || card.characterCard?.data?.name,
          image: card.assets?.image?.url,
          record: card,
        } as any,
      },
    ];
    this.flowStateService.nodes.set(nodes);
  }

  public async saveFlow() {
    const flowData = this.serializeFlow();
    console.log('Flow saved:', flowData);
    const flow: IFlow = {
      id: this.flowId,
      nodes: flowData.nodes,
      edges: flowData.edges,
    };
    const response = await this.flowService.saveFlow(flow);
    console.log('Flow saved:', response);
  }

  public serializeFlow(): { nodes: any[]; edges: any[] } {
    const serializableNodes = this.flowStateService.nodes().map(node => {
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

    const serializableEdges = this.flowStateService.edges().map(edge => ({ ...edge }));

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
      let dynamicNode: DynamicNode;

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

    this.flowStateService.nodes.set(nodes);

    this.flowStateService.edges.set(savedFlowData.edges.map((edge: any) => ({ ...edge })));

    console.log('Flow loaded:', this.flowStateService.getFlow()?.nodes, this.flowStateService.getFlow()?.edges);
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
}
