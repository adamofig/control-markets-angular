import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ChatRole, DCChatComponent, IConversationSettings } from '@dataclouder/ngx-agent-cards';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomTaskNode } from '../task-node';
import { NodeSearchesService } from '../../../services/node-searches.service';
import { NodeType } from '../../../models/flows.model';
import { groupBy } from 'es-toolkit/array';

@Component({
  selector: 'app-task-conversation',
  templateUrl: './task-conversation.html',
  styleUrls: ['./task-conversation.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DCChatComponent],
})
export class TaskConversationComponent implements OnInit {
  public conversationSettings: IConversationSettings | null = null;
  public dialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public node: CustomTaskNode | null = null;
  public nodeSearchesService = inject(NodeSearchesService);

  ngOnInit(): void {
    this.node = this.config.data;

    const inputNodes = this.nodeSearchesService.getInputNodes(this.node?.id!);
    const groupedInputNodes = groupBy(inputNodes, item => item.component);

    const sourceNode = groupedInputNodes[NodeType.SourcesNodeComponent];
    const agents = groupedInputNodes[NodeType.AgentNodeComponent];

    const agentData = agents[0].data;
    const sourceNodeData = sourceNode?.[0]?.data;

    // TODO: Revisar como voy a construir a mis agentes...
    console.log(sourceNodeData);

    const systemMessages = [{ role: ChatRole.System, content: 'Hello' }];

    // throw new Error('Method not implemented.');

    this.conversationSettings = {
      messages: [{ role: ChatRole.Assistant, content: 'Hello' }],
    };
  }
}
