import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAgentSource, SourceType, SourceTypeOptions } from '../models/sources.model';
import { SourceService } from '../sources.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Textarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { NotionService } from '../../tasks/services/notion.service';
import { NotionExportType } from '../../tasks/models/notion.models';
import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';

@Component({
  selector: 'app-source-form',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, DropdownModule, Textarea, ButtonModule],
  templateUrl: './source-form.component.html',
  styleUrl: './source-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceFormComponent implements OnInit {
  sourceForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    type: [''],
    content: [''],
    sourceUrl: [''],
    img: [''],
  });
  sourcesTypes = SourceTypeOptions;

  constructor(
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    private route: ActivatedRoute,
    private sourceService: SourceService,
    private fb: FormBuilder,
    private router: Router,
    private notionService: NotionService
  ) {}

  public source: IAgentSource | null = null;
  public sourceId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.sourceId) {
      this.source = await this.sourceService.getSource(this.sourceId);
      if (this.source) {
        this.sourceForm.patchValue(this.source);
      }
    }
  }

  async saveSource() {
    if (this.sourceForm.valid) {
      const source = { ...this.source, ...this.sourceForm.value } as IAgentSource;

      const result = await this.sourceService.saveSource(source);

      if (!this.sourceId) {
        this.router.navigate([result.id], { relativeTo: this.route });
      }
      this.toastService.success({
        title: 'Origen guardado',
        subtitle: 'El origen ha sido guardado correctamente',
      });
    }
  }

  async updateSource() {
    if (this.sourceForm.valid) {
      switch (this.sourceForm.value.type) {
        case SourceType.DOCUMENT:
          await this.updateDocumentSource();
          break;
        case SourceType.WEBSITE:
          await this.updateWebsiteSource();
          break;
        case SourceType.YOUTUBE:
          await this.updateYoutubeSource();
          break;
        case SourceType.NOTION:
          await this.updateNotionSource();
          break;
      }
    }
  }

  private async updateDocumentSource() {
    throw new Error('Not implemented');
  }

  private async updateWebsiteSource() {
    throw new Error('Not implemented');
  }

  private async updateYoutubeSource() {
    const youtubeUrl = this.sourceForm.controls.sourceUrl.value;
    const transcript: any = await this.sourceService.getYoutubeContent(youtubeUrl as string);
    this.sourceForm.patchValue({
      content: transcript.text,
    });
  }

  private async updateNotionSource() {
    const notionUrl = this.sourceForm.controls.sourceUrl.value;

    const notionId = this.notionService.extractNotionPageId(notionUrl as string);
    if (!notionId) {
      throw new Error('Notion ID not found');
    }

    const page = await this.notionService.getPageInSpecificFormat(notionId, NotionExportType.MARKDOWN);
    this.toastService.success({
      title: 'Notion page fetched',
      subtitle: 'The notion page has been fetched successfully',
    });
    this.sourceForm.patchValue({
      content: page.content,
    });

    // throw new Error('Not implemented');
  }

  public goToSourceDetail(sourceId: string) {
    this.router.navigate(['../../details', sourceId], { relativeTo: this.route });
  }
}
