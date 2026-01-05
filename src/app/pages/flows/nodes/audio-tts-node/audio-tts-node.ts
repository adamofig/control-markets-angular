import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-audio-tts-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content">
      <p>Text to Speech</p>
      <i class="pi pi-megaphone" style="font-size: 2.5rem"></i>
    </div>
  `,
  styles: [`
    .content {
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #dfdfdf;
      gap: 10px;
    }
    p {
      margin: 0;
      font-weight: bold;
    }
  `]
})
export class AudioTTsNodeComponent {
  // Add any inputs if needed for the preview, though for now it's static
}
