import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

import { DCAgentCardFormComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';

import { AlertController } from '@ionic/angular/standalone';

import { RouteNames } from 'src/app/core/enums';
import { AgentCardService } from 'src/app/services/agent-card-service';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-agent-card-form',
  standalone: true,
  imports: [DCAgentCardFormComponent],
  templateUrl: './agent-card-form.html',
  styleUrl: './agent-card-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCardFormPage implements OnInit {
  public appConfigService = inject(AppConfigService);
  private conversationCardsService = inject(AgentCardService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  public currentPath: string = ' ';

  public projectName = this.appConfigService.config.projectName;

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }

  public onSave() {
    this.alertController.create({
      header: 'Save',
      message: 'Conversation saved',
      buttons: ['OK'],
    }).then((alert: HTMLIonAlertElement) => alert.present());
  }

  public async goToDetails(id: string) {
    this.router.navigate([RouteNames.Page, RouteNames.Stack, RouteNames.ConversationDetails, id]);
  }
}
