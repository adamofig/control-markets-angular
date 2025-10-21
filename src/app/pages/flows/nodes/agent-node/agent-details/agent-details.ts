import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { JsonPipe } from '@angular/common';
import { IAgentCard } from '@dataclouder/ngx-agent-cards';
import { DynamicNode } from 'ngx-vflow';
import { ConversationPromptBuilderService } from '@dataclouder/ngx-agent-cards';
import { PromptPreviewComponent, DefaultAgentCardsService } from '@dataclouder/ngx-agent-cards';

@Component({
  selector: 'app-distribution-chanel-details',
  imports: [ButtonModule, JsonPipe, PromptPreviewComponent],
  templateUrl: './agent-details.html',
  styleUrl: './agent-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentDetailsComponent {
  public dynamicDialogConfig = inject(DynamicDialogConfig);

  public agentCard!: IAgentCard;
  public node!: DynamicNode;

  public messages!: any[];

  private promptBuilder = inject(ConversationPromptBuilderService);

  // Creo que necesito el método defaultAgen service para obtern los datos
  // private agentService = inject(AgentService);
  private defaultAgentCardsService = inject(DefaultAgentCardsService);

  constructor() {
    console.log('agent-details', this.dynamicDialogConfig.data);
  }

  public backgroundImage: string | null = null;

  ngOnInit(): void {
    console.log('agent-details', this.dynamicDialogConfig.data);
    this.agentCard = this.dynamicDialogConfig.data.agentCard;
    this.node = this.dynamicDialogConfig.data.node;
    if (this.agentCard.assets?.image?.url) {
      this.backgroundImage = this.agentCard.assets.image.url;
    }

    this.getAgentCardFromDB();
  }

  public async getAgentCardFromDB(): Promise<IAgentCard> {
    const id = this.agentCard._id || this.agentCard.id;

    const agentCard = await this.defaultAgentCardsService.findOneByQuery({ id: id }, { characterCard: 1, conversationFlow: 1 });
    this.messages = this.promptBuilder.buildConversationMessages(agentCard);

    return agentCard;
  }

  public startFlow(): void {}
}
