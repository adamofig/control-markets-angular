import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ChatMessage, ChatRole, DCChatComponent, DefaultAgentCardsService, IAgentCard, IConversationSettings } from '@dataclouder/ngx-agent-cards';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomTaskNode } from '../task-node';
import { NodeSearchesService } from '../../../services/node-searches.service';
import { NodeTypeStr } from '../../../models/flows.model';
import { groupBy } from 'es-toolkit/array';
import { NodePromptBuilderService, PersonaExtractionLevel } from '../../../services/node-prompt-builder.services';
import { EModelQuality } from '@dataclouder/ngx-core';

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
  private nodePromptBuilder = inject(NodePromptBuilderService);

  public imgBackground = signal<string | null>(null);

  ngOnInit(): void {
    this.node = this.config.data;

    const agentTask: IAgentCard = this.config?.data?.data?.nodeData;

    const inputNodes = this.nodeSearchesService.getInputNodes(this.node?.id!);
    const contextPrompts = this.nodePromptBuilder.getContextPrompts(inputNodes);
    const groupedInputNodes = groupBy(inputNodes, item => item.component);
    const agents = groupedInputNodes[NodeTypeStr.AgentNodeComponent];
    const agentData = agents[0].data.nodeData;

    this.imgBackground.set(agentData?.assets?.image?.url || '');
    console.log('imgBackground', this.imgBackground());

    this.buildInitialConversation(agentData?._id || agentData?.id, contextPrompts, agentTask);
  }

  public async buildInitialConversation(id: string, contextPrompts: ChatMessage[], agentTask: IAgentCard) {
    // Probably i would like to project, but may be i can play with flow conversations so, and i may need some more data.
    const agent = await this.agentService.findOneByQuery({ _id: id });
    this.agentCard.set(agent);
    // Por ahora solo va a funcionar con la descripción

    const personaMessages = this.nodePromptBuilder.getAgentCardPersona(agent, PersonaExtractionLevel.BASIC);
    if (personaMessages.length > 0) {
      contextPrompts.push(...personaMessages);
    } else {
      const description = agent.characterCard?.data.description;
      const prompt = 'You are ai agent here is your description: ' + description;
      const ms = { role: ChatRole.System, content: prompt, messageId: 'Description' };
      contextPrompts.push(ms);
    }

    const systemMessages: ChatMessage[] = [...contextPrompts];

    // throw new Error('Method not implemented.');
    if (agentTask.description) {
      systemMessages.push({ role: ChatRole.System, content: agentTask.description, messageId: 'Description Task' });
    }
    this.conversationSettings.set({
      messages: systemMessages,
      userMustStart: true,
      model: { quality: EModelQuality.BALANCED },
      avatarImages: {
        user: 'assets/defaults/icons/default-avatar.png',
        assistant: agent.assets?.image?.url || '',
      },
    });
    return agent;
  }
}
