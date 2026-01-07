import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageContent, MessageContentDisplayer } from '@dataclouder/ngx-agent-cards';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-audio-node',
  templateUrl: './audio-node.component.html',
  styleUrls: ['./audio-node.component.scss'],
  standalone: true,
  imports: [TagModule, CommonModule, MessageContentDisplayer],
})
export class AudioNodeComponent {
  @Input() name: string = '';
  @Input() storage: { url: string } = { url: '' };
  @Input() transcription: any;

  public baseMessage = computed<MessageContent | undefined>(() => {
    if (this.storage?.url) {
      return {
        messageId: 'audio-' + (this.name || 'node'),
        text: this.transcription?.text || this.name,
        audioUrl: this.storage.url,
        transcription: this.transcription,
      };
    }
    return undefined;
  });
}

