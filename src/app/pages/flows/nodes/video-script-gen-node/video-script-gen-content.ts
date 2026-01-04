import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { VideoScriptGenDetailsComponent } from './video-gen-details/video-script-gen-details';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-video-script-gen-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-script-gen-content.html',
  styles: [`
    .content {
      padding: 10px;
      font-size: 0.9em;
      color: #dfdfdf;
    }
    .prompt-preview, .script-preview {
      margin-bottom: 10px;
    }
    p {
      margin: 4px 0 0 0;
      white-space: pre-wrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    strong {
      color: #ffffff;
    }
    .no-data {
      color: #888;
      font-style: italic;
    }
  `]
})
export class VideoScriptGenContentComponent {
  @Input() prompt?: string;
  @Input() script?: string;

    public dialogService = inject(DialogService);


    public openModal() {
  
      const nodeData = {};
      this.dialogService.open(VideoScriptGenDetailsComponent, {
        header: 'Empty Node Details',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        draggable: true,
        styleClass: 'draggable-dialog',
        closable: true,
        width: '650px',
        duplicate: true, 
        modal: true,
        data: {
          ...nodeData,
        },
      });
    }
}
