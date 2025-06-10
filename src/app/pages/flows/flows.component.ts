import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Connection, DynamicNode, Edge, Vflow } from 'ngx-vflow';
import { CircularNodeComponent, NodeData } from './circular-node.component';
import { AgentNodeComponent } from './agent-node/agent-node.component';
import { DistributionChanelNodeComponent } from './distribution-chanel-node/distribution-chanel-node.component';
import { OutcomeNodeComponent } from './outcome-node/outcome-node.component';
import { TaskNodeComponent } from './task-node/task-node.component';
import { DialogModule } from 'primeng/dialog';
import { AgentCardListPage } from '../agent-cards/agent-card-list/agent-card-list';
import { AgentCardListComponent } from '@dataclouder/ngx-agent-cards';
import { OnActionEvent } from '@dataclouder/ngx-core';

@Component({
  templateUrl: './flows.component.html',
  styleUrl: './flows.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Vflow, DialogModule, AgentCardListComponent],
})
export class FlowsComponent {
  public isDialogVisible = false;
  public backDots = {
    backgroundColor: 'transparent',
    color: '#f4fc0088',
    type: 'dots' as any,
    size: 1,
  };

  public showAgents() {
    this.isDialogVisible = true;
  }

  public nodes: DynamicNode[] = [
    // {
    //   id: '1',
    //   point: signal({ x: 100, y: 100 }),
    //   type: 'html-template',
    //   data: signal({
    //     customType: 'agent-card',
    //     text: 'This is the node',
    //     image:
    //       'https://firebasestorage.googleapis.com/v0/b/niche-market-dev.firebasestorage.app/o/conversation-cards%2F67e1e0dba60280a761d75d8a%2Fnull-wtecyekgx8b.webp?alt=media&token=e6e2470e-bf5c-4a5f-9007-e508a3f359c2',
    //   }),
    // },

    {
      id: '3',
      point: signal({ x: 250, y: 250 }),
      type: 'default',
      text: signal('Default'),
    },

    {
      id: '4',
      point: signal({ x: 450, y: 450 }),
      type: AgentNodeComponent as any,
      data: {
        text: 'Circular Node',
        image:
          'https://firebasestorage.googleapis.com/v0/b/niche-market-dev.firebasestorage.app/o/conversation-cards%2F67e1e0dba60280a761d75d8a%2Fnull-wtecyekgx8b.webp?alt=media&token=e6e2470e-bf5c-4a5f-9007-e508a3f359c2',
      } as any,
    },

    {
      id: '5',
      point: signal({ x: 150, y: 450 }),
      type: DistributionChanelNodeComponent as any,
      data: {
        text: 'Distribution Chanel Node',
        image: 'https://vleeko.net/wp-content/uploads/2014/10/blog.jpg',
      } as any,
    },

    {
      id: '6',
      point: signal({ x: 150, y: 350 }),
      type: OutcomeNodeComponent as any,
      data: {
        text: 'Outcome Node',
        image:
          'https://firebasestorage.googleapis.com/v0/b/niche-market-dev.firebasestorage.app/o/conversation-cards%2F67e1e0dba60280a761d75d8a%2Fnull-wtecyekgx8b.webp?alt=media&token=e6e2470e-bf5c-4a5f-9007-e508a3f359c2',
      } as any,
    },

    {
      id: '7',
      point: signal({ x: 550, y: 150 }),
      type: TaskNodeComponent as any,
      data: {
        text: 'Task Node',
        image:
          'https://www.monitask.com/wp-content/uploads/2024/02/master-your-task-management-%E2%80%A8how-the-1-3-5-rule-revolutionizes-%E2%80%A8to-do-lists.png',
      } as any,
    },
  ];

  public edges: Edge[] = [
    {
      id: '1 -> 2',
      source: '1',
      target: '2',
    },
  ];

  public createEdge({ source, target }: Connection) {
    this.edges = [
      ...this.edges,
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
  }

  handleRelationSelection(event: OnActionEvent) {
    console.log('handleRelationSelection', event);
    debugger;
  }
}
