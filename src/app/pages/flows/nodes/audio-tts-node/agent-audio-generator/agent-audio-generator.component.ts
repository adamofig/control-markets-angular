import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HttpCoreService } from '@dataclouder/ngx-core';
import { IAgentCard, DefaultAgentCardsService } from '@dataclouder/ngx-agent-cards';

@Component({
  selector: 'app-agent-audio-generator',
  imports: [CommonModule, TextareaModule, FormsModule, ButtonModule],
  templateUrl: './agent-audio-generator.component.html',
  styleUrls: ['./agent-audio-generator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AgentAudioGeneratorComponent implements OnInit {
  async ngOnInit(): Promise<void> {
    console.log('ngOnInit', this.agentCard);
    console.log('ngOnInit', this.config.inputValues.agentCard);
    const id = this.agentCard._id || '';
    const agentCard = await this.defaultAgentCardsService.findOne(id);
    console.log('full agent ID', agentCard);
    this.fullAgentCard = agentCard;
    
  }
  public config = inject(DynamicDialogConfig);
  public ref = inject(DynamicDialogRef);
  public message = '';

  @Input() agentCard: IAgentCard = {} as IAgentCard;

  fullAgentCard: IAgentCard = {} as IAgentCard;

  public defaultAgentCardsService = inject(DefaultAgentCardsService);

  public httpCoreService = inject(HttpCoreService);

  generateAudio() {
    debugger;

    // this.fullAgentCard.voiceClon
    console.log('generateAudio', this.message);
    
    // this.httpCoreService.postHttp('/api/agent/audio', { message: this.message });


    this.ref.close({ message: this.message });
  }

  cancel() {
    this.ref.close();
  }
}
