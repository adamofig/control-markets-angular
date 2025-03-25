import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sendOutline, sendSharp, send } from 'ionicons/icons';
import {
  ChatUserSettings,
  IConversationSettings,
  ChatRole,
  AgentCardListComponent,
  AudioSpeed,
  IAgentCard,
  AgentCardsAbstractService,
  CONVERSATION_AI_TOKEN,
} from '@dataclouder/ngx-agent-cards';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
<<<<<<<< HEAD:src/app/pages/agents/agent-card-list/agent-card-list.ts
import { NotionService } from '../../tasks/services/notion.service';
import { ToastAlertService } from 'src/app/services/toast.service';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
========
import { ButtonModule } from 'primeng/button';
>>>>>>>> upstream/main:src/app/pages/chat/agent-card-list/agent-card-list.ts

@Component({
  selector: 'app-chat',
  templateUrl: './agent-card-list.html',
  styleUrls: ['./agent-card-list.scss'],
  standalone: true,
<<<<<<<< HEAD:src/app/pages/agents/agent-card-list/agent-card-list.ts
  imports: [CommonModule, FormsModule, IonContent, AgentCardListComponent],
========
  imports: [CommonModule, FormsModule, IonContent, AgentCardListComponent, ButtonModule],
>>>>>>>> upstream/main:src/app/pages/chat/agent-card-list/agent-card-list.ts
})
export class ChatComponentPage {
  public conversationUserSettings: ChatUserSettings = {
    realTime: false,
    repeatRecording: false,
    fixGrammar: false,
    superHearing: false,
    voice: 'default',
    autoTranslate: false,
    highlightWords: false,
    synthVoice: false,
    speed: AudioSpeed.Regular,
    speedRate: 1,
  };

<<<<<<<< HEAD:src/app/pages/agents/agent-card-list/agent-card-list.ts
  public ConversationPromptSettings: IConversationSettings = {
========
  public viewMode: 'table' | 'cards' = 'table';

  public IConversationSettings: IConversationSettings = {
>>>>>>>> upstream/main:src/app/pages/chat/agent-card-list/agent-card-list.ts
    messages: [
      { role: ChatRole.System, content: 'you are a helpful assistant talking about fruits, vegetables and similar' },
      {
        role: ChatRole.Assistant,
        content: 'hello! How can I assist you today, do you want to know about fruits?',
      },
    ],
  };

  messages: any[] = [];
  newMessage: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private notionService: NotionService,
    private toastAlert: ToastAlertService,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    @Inject(CONVERSATION_AI_TOKEN) private agentCardService: AgentCardsAbstractService
  ) {
    addIcons({ send, sendOutline, sendSharp });
  }

<<<<<<<< HEAD:src/app/pages/agents/agent-card-list/agent-card-list.ts
========
  ngOnInit() {
    // Initialize with some dummy messages
  }

  public actions: MenuItem[] = [
    { title: 'details', label: 'Ver detalles', icon: 'ionicons:pencil' },
    { title: 'edit', label: 'Editar', icon: 'ionicons:edit' },
    { title: 'delete', label: 'Eliminar', icon: 'ionicons:trash' },
  ];

  public goToDetails(idCard: any) {
    console.log('goToDetails', idCard);
    const navigationExtras: NavigationExtras = {
      state: {
        conversation: idCard,
      },
    };
    this.router.navigate(['/page/stack/conversation-details', idCard], navigationExtras);
  }

  public goToEdit(idCard: any) {
    if (idCard) {
      this.router.navigate(['/page/stack/conversation-form', idCard]);
    } else {
      this.router.navigate(['/page/stack/conversation-form']);
    }
  }

>>>>>>>> upstream/main:src/app/pages/chat/agent-card-list/agent-card-list.ts
  public getCustomButtons(card: IAgentCard): MenuItem[] {
    // 🥛 powerfull use of closures
    // [getCustomButtons]: its really hard to explain but, since it use speeddial, i can pass data it self only funtions, and the only way to pass is at initialization time [model]="getCustomButtons(card)"
    // so that why i'm passing a closure function, that means that the command/function will be created with params at the moment of the initialization
    // and becouse i'm using function in this context and in to bind(this) -> getCustomButtons.bind(this)
    return [
      {
        label: 'Ver detalles',
        tooltipOptions: { tooltipLabel: 'Ver detalles', tooltipPosition: 'bottom' },
        icon: 'pi pi-eye',
        command: () => this.doAction('view', card),
      },
      {
        icon: 'pi pi-pencil',
        tooltipOptions: { tooltipLabel: 'Editar', tooltipPosition: 'bottom' },
        command: () => this.doAction('edit', card),
      },
      {
        icon: 'pi pi-trash',
        tooltipOptions: { tooltipLabel: 'Eliminar', tooltipPosition: 'bottom' },
        command: () => this.doAction('delete', card),
      },
    ];
  }

  public async doAction(action: string, item: any) {
    const itemId = item._id || item.id;
    switch (action) {
      case 'view':
        this.router.navigate(['./details', item.id], { relativeTo: this.route });
        break;
      case 'delete':
        const areYouSure = confirm('¿Estás seguro de querer eliminar este origen?');
        if (areYouSure) {
          await this.agentCardService.deleteConversationCard(item.id);
          // this.conversationCards = this.conversationCards.filter((card) => card._id !== id);

          this.toastService.success({ title: 'Conversation card deleted', subtitle: 'Pero tienes que actualizar la página para ver el cambio' });

          this.cdr.detectChanges();
        }

        break;
      case 'edit':
        this.router.navigate(['../stack/conversation-form', itemId], { relativeTo: this.route });
        break;
    }
  }

<<<<<<<< HEAD:src/app/pages/agents/agent-card-list/agent-card-list.ts
  public goToDetails(idCard: any) {
    console.log('goToDetails', idCard);
    const navigationExtras: NavigationExtras = {
      state: {
        conversation: idCard,
      },
    };
    this.router.navigate(['/page/stack/conversation-details', idCard], navigationExtras);
  }

  public goToEdit(idCard: any) {
    if (idCard) {
      this.router.navigate(['/page/stack/conversation-form', idCard]);
    } else {
      this.router.navigate(['/page/stack/conversation-form']);
    }
  }

  public handleMenuAction(event: any, action: string, card: IAgentCard) {
    // const card = data.card; // The card data will be passed from the template
    switch (action) {
      case 'createNotionPage':
        console.log('Creating Notion page:', card);
        this.createNotionPage(card);
        break;
    }
  }

  public async createNotionPage(card: IAgentCard) {
    this.toastAlert.info({ title: 'Creando página Notion para tu agente', subtitle: 'Por favor, espere...' });

    console.log('Creating Notion page:', card);
    const response = await this.notionService.createNotionPage(card);
    console.log('Response:', response.page);
    if (response.success) {
      window.open(response.page.url, '_blank');
      this.toastAlert.success({ title: 'Página Notion creada correctamente', subtitle: 'Puedes verla en tu Notion' });
    } else {
      this.toastAlert.error({ title: 'Error al crear la página Notion', subtitle: response.error });
========
  handleAction({ item, action }: { item: any; action: MenuItem }) {
    
    console.log('doAction', { item, action });
    if (action.title === 'edit') {
      this.goToEdit(item._id);
    } else if (action.title === 'delete') {
      this.doAction('delete', item);
    } else if (action.title === 'details') {
      this.goToDetails(item._id);
    } else {
      console.log('Unknown action:', action);
>>>>>>>> upstream/main:src/app/pages/chat/agent-card-list/agent-card-list.ts
    }
  }
}
