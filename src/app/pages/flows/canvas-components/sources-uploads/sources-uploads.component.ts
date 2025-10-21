import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { nanoid } from 'nanoid';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { IAgentSource } from 'src/app/pages/sources/models/sources.model';

@Component({
  selector: 'app-sources-uploads',
  templateUrl: './sources-uploads.component.html',
  styleUrls: ['./sources-uploads.component.scss'],
  standalone: true,
  imports: [TextareaModule, FormsModule, ButtonModule, SelectModule],
})
export class SourcesUploadsComponent {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);

  public entityId: string | null = null;

  public contentSource: string = '';
  public selectedTag: string = 'rule';
  public tags: string[] = ['rule', 'context'];

  @Output() sourceUploaded = new EventEmitter<Partial<IAgentSource>>();

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
          this.sourceUploaded.emit({
            id: nanoid(),
            name: file.name,
            content: markdownContent,
            tag: this.selectedTag,
          });
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

  public onSourceSave() {
    const source = {
      id: nanoid(),
      name: 'Source',
      content: this.contentSource,
      tag: this.selectedTag,
    };
    this.sourceUploaded.emit(source);
  }
}
