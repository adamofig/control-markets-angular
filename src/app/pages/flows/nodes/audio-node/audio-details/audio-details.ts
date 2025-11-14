import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IAudioAssetsNodeData } from '../../../models/nodes.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-audio-details',
  templateUrl: './audio-details.html',
  styleUrls: ['./audio-details.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, RippleModule],
})
export class AudioDetailsComponent implements OnInit {
  @Input() nodeData: IAudioAssetsNodeData | undefined;

  public showTranscriptionJson = false;

  ngOnInit(): void {
    console.log('audio-details', this.nodeData);
  }

  get transcriptionJson() {
    return JSON.stringify(this.nodeData?.transcription, null, 2);
  }

  copyToClipboard(text: string | undefined | object) {
    if (!text) {
      return;
    }
    const textToCopy = typeof text === 'object' ? JSON.stringify(text, null, 2) : text;
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        console.log('Copied to clipboard');
        // You can add a toast message here to notify the user
      },
      err => {
        console.error('Could not copy text: ', err);
      }
    );
  }
}
