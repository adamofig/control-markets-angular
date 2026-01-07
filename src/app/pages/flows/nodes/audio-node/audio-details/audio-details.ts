import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IAudioAssetsNodeData } from '../../../models/nodes.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-audio-details',
  templateUrl: './audio-details.html',
  styleUrls: ['./audio-details.scss'],
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, RippleModule],
})
export class AudioDetailsComponent implements OnInit {
  public nodeData: IAudioAssetsNodeData | undefined;
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  public showTranscriptionJson = false;

  ngOnInit(): void {
    this.nodeData = this.config.data?.data?.nodeData;
    console.log('audio-details', this.nodeData);
  }

  get transcriptionJson() {
    const replacer = (key: any, value: any) => {
      if (key === 'words') {
        return JSON.stringify(value);
      }
      return value;
    };
    return JSON.stringify(this.nodeData?.transcription, replacer, 2).replace(/\\"/g, '"').replace(/"\[/g, '[').replace(/]"/g, ']');
  }

  copyToClipboard(text: string | undefined | object) {
    if (!text) {
      return;
    }
    const textToCopy = typeof text === 'object' ? this.transcriptionJson : text;
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
