import { ChangeDetectorRef, Component, Input, OnInit, inject, effect } from '@angular/core';

import {
  DCChatComponent,
  IConversationSettings,
  ChatRole,
  AudioSpeed,
  IAgentCard,
  ChatMonitorService,
  AGENT_CARDS_STATE_SERVICE,
} from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute } from '@angular/router';
import { ChatUserSettings } from '@dataclouder/ngx-core';
import { CONVERSATION_AI_TOKEN } from '@dataclouder/ngx-agent-cards';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { UserService } from '@dataclouder/ngx-users';
import { ConceptStatus, ILearningUserState, KnowledgeLearningSystemService } from '@dataclouder/ngx-knowledge';

@Component({
  selector: 'app-agent-card-chat',
  standalone: true,
  imports: [DCChatComponent],
  templateUrl: './agent-card-chat.html',
  styleUrls: ['./agent-card-chat.scss'],
})
export class AgentCardChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private conversationCardsService = inject(CONVERSATION_AI_TOKEN);
  private cdr = inject(ChangeDetectorRef);
  private chatMonitorService = inject(ChatMonitorService);
  private toastrService = inject(TOAST_ALERTS_TOKEN);
  private userService = inject(UserService);
  private knowledgeLearningSystemService = inject(KnowledgeLearningSystemService);
  private agentCardsMasterStateService = inject(AGENT_CARDS_STATE_SERVICE);

  constructor() {
    effect(() => {
      const message = this.chatMonitorService.messageAudioWillPlay$();
      if (message) {
        console.log('AgentCardChatComponent: Audio will play for message:', message);
      }
    });
  }

  @Input() agentCard!: IAgentCard;
  public conversationSettings: IConversationSettings = {
    messages: [{ text: 'you are having a conversation with?', content: 'bot', role: ChatRole.System }],
  };

  public chatUserSettings: ChatUserSettings = {
    realTime: false,
    repeatRecording: false,
    superHearing: false,
    voice: 'en-US',
    synthVoice: false,
    highlightWords: false,
    speedRate: 1,
    speed: AudioSpeed.Regular,
    userMessageTask: false,
    assistantMessageTask: false,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      // TODO fix this, card can be passed as param (WIP), or fetched from the service
      this.agentCard = JSON.parse(params.get('conversationCard')!);
      if (!this.agentCard) {
        const id = params.get('id') as string;
        const card = await this.conversationCardsService.findOne(id);
        console.log('loading agent card...');
        this.agentCard = card;
        this.cdr.detectChanges();
      }
    });
  }

  public async onGoalCompleted(event: any) {
    console.log('Hurray ', event);
    this.toastrService.success({ subtitle: 'Muy bien anotaré tu esfuerzo', title: 'La conversación esta completada, puedes cerrar el dialogo cuando gustes' });

    const path = `agentCards`;

    const progress: ILearningUserState = {
      id: this.agentCard.id || '',
      path: path,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      status: ConceptStatus.Learned,
      learningType: 'learningExperience',
      learningExperience: {
        score: 100,
        goalCompleted: true,
      },
      stats: {
        progress: 100,
        totalReviews: 1,
        successCount: 1,
        failedCount: 0,
        totalTimeSpent: 0,
      },
    };

    // TODO: estos 2 deberían ir juntos en la misma función. como en words service que hay metodo actualiza el estado y el backend.
    const response = await this.knowledgeLearningSystemService.saveProgress(progress);
    if (response) {
      console.log(response);
      this.agentCardsMasterStateService.updateUserState(progress);
    }
  }

  // Add your component logic here
}
