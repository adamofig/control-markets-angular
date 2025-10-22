import { Component, OnInit, effect, inject } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { DcAgentCardDetailsComponent, IAgentCard, ChatMonitorService, ConversationPromptBuilderService } from '@dataclouder/ngx-agent-cards';
import { unset } from 'es-toolkit/compat';

@Component({
  selector: 'app-agent-card-details',
  templateUrl: './agent-card-details.html',
  styleUrls: ['./agent-card-details.scss'],
  standalone: true,
  imports: [DcAgentCardDetailsComponent],
})
export class AgentCardDetailsPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // messages = this.promptBuilder.buildConversationMessages(this.form.value as any);

  private chatMonitorService = inject(ChatMonitorService);

  conversationId: any;

  constructor() {
    // First try to get from state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { conversation: any };
    if (state?.conversation) {
      this.conversationId = state.conversation;
    } else {
      // If not in state, get from path params
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.conversationId = params['id'];
        }
      });
    }
  }

  ngOnInit() {
    if (!this.conversationId) {
      this.router.navigate(['/page/agents']);
    }
  }

  public startConversation(card: IAgentCard) {
    const newCard = this.rewriteCard(card);
    console.log('startConversation', newCard);
    this.router.navigate(['/page/stack/chat', newCard._id], {
      state: {
        conversation: newCard,
      },
    });
  }

  public rewriteCard(card: IAgentCard): IAgentCard {
    console.log('rewriteCard', card);
    unset(card, 'characterCard.data.persona.identity');
    unset(card, 'characterCard.data.persona.physical');
    // unset(card, 'characterCard.data.persona.personality');
    // unset(card, 'characterCard.data.persona.communication');
    // unset(card, 'characterCard.data.persona.psychology');
    unset(card, 'characterCard.data.persona.background');
    // unset(card, 'characterCard.data.persona.capabilities');
    unset(card, 'characterCard.data.persona.social');
    unset(card, 'characterCard.data.persona.preferences');
    unset(card, 'characterCard.data.persona.situation');

    alert('rewriteCard');
    return card;
  }

  public startTask() {
    console.log('startTask', this.conversationId);
    alert('startTask');
  }
}
