import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ChatMessage, ChatRole, DCChatComponent, DefaultAgentCardsService, IAgentCard, IConversationSettings } from '@dataclouder/ngx-agent-cards';
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
  public conversationSettings = signal<IConversationSettings | null>(null);
  public dialogRef = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  public node: CustomTaskNode | null = null;
  public nodeSearchesService = inject(NodeSearchesService);
  public agentService = inject(DefaultAgentCardsService);
  public agentCard = signal<IAgentCard | null>(null);

  ngOnInit(): void {
    this.node = this.config.data;

    const agentTask: IAgentCard = this.config?.data?.data?.nodeData;

    const inputNodes = this.nodeSearchesService.getInputNodes(this.node?.id!);
    const groupedInputNodes = groupBy(inputNodes, item => item.component);
    const sourceNode = groupedInputNodes[NodeType.SourcesNodeComponent] || [];
    const agents = groupedInputNodes[NodeType.AgentNodeComponent];

    let context = '';
    if (sourceNode.length >= 1) {
      for (const source of sourceNode) {
        if (source.data.nodeData.tag === 'rule') {
          context += source.data.nodeData.content + '\n';
        } else {
          context += source.data.nodeData.content + '\n';
        }
      }
    }

    const agentData = agents[0].data.nodeData;

    this.buildInitialConversation(agentData?._id || agentData?.id, context, agentTask);
  }

  public async buildInitialConversation(id: string, context: string, agentTask: IAgentCard) {
    // Probably i would like to project, but may be i can play with flow conversations so, and i may need some more data.
    const agent = await this.agentService.findOneByQuery({ _id: id });
    this.agentCard.set(agent);
    // Por ahora solo va a funcionar con la descripción

    const description = agent.characterCard?.data.description;
    const prompt = 'You are ai agent here is your description: ' + description;
    const contextPrompt = 'Here is the context you need to know: ' + context;

    const systemMessages: ChatMessage[] = [
      { role: ChatRole.System, content: prompt, messageId: 'Description' },
      { role: ChatRole.System, content: contextPrompt, messageId: 'Context' },
    ];

    // throw new Error('Method not implemented.');
    if (agentTask.description) {
      systemMessages.push({ role: ChatRole.System, content: agentTask.description, messageId: 'Description Task' });
    }
    this.conversationSettings.set({
      messages: systemMessages,
    });
    return agent;
  }
}
