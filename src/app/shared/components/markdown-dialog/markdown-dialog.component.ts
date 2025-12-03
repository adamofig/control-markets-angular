import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-dialog',
  template: ` <div [innerHTML]="content | markdown"></div> `,
  standalone: true,
  imports: [CommonModule, MarkdownModule],
})
export class MarkdownDialogComponent {
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  content = '';

  ngOnInit() {
    this.content = this.config.data.content;
  }
}
