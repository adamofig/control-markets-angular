import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { nanoid } from 'nanoid';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-sources-uploads',
  templateUrl: './sources-uploads.component.html',
  styleUrls: ['./sources-uploads.component.scss'],
  standalone: true,
  imports: [TextareaModule, FormsModule, ButtonModule],
})
export class SourcesUploadsComponent {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  public entityId: string | null = null;

  public value: string = '';

  @Output() sourceUploaded = new EventEmitter<string>();

  constructor() {
    this.entityId = this.route.snapshot.paramMap.get('id');
  }

  public onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const markdownContent = e.target?.result as string;
          this.sourceUploaded.emit(markdownContent);
        };
        reader.onerror = e => {
          console.error('Error reading file:', e);
        };
        reader.readAsText(file);
      } else {
        console.warn('Please select a Markdown (.md) file.');
      }
    }
  }
}
