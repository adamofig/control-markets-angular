import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

import { DCAgentCardFormComponent, IAgentCard } from '@dataclouder/ngx-agent-cards';

import { AlertController } from '@ionic/angular/standalone';

import { environment } from 'src/environments/environment';
import { RouteNames } from 'src/app/core/enums';

@Component({
  selector: 'app-agent-card-form',
  standalone: true,
  imports: [DCAgentCardFormComponent],
  templateUrl: './agent-card-form.html',
  styleUrl: './agent-card-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCardFormPage implements OnInit {
  private router = inject(Router);
  private AlertController = inject(AlertController);
  private toastController = inject(ToastController);

  public currentPath: string = ' ';

  public projectName = environment.projectName;

  ngOnInit(): void {
    this.currentPath = this.router.url.split('/')[3];
  }

  public onSave() {
    this.AlertController.create({
      header: 'Save',
      message: 'Conversation saved',
      buttons: ['OK'],
    }).then(alert => alert.present);
  }

  public async goToDetails(id: string) {
    this.router.navigate([RouteNames.Page, RouteNames.Stack, RouteNames.ConversationDetails, id]);
  }
}
