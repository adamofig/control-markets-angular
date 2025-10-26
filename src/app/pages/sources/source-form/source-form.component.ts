import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAgentSource, SourceType, SourceTypeOptions } from '../models/sources.model';
import { SourceService } from '../sources.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NotionService } from '../../tasks/services/notion.service';
import { NotionExportType } from '../../tasks/models/notion.models';
import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-source-form',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, SelectModule, TextareaModule, ButtonModule],
  templateUrl: './source-form.component.html',
  styleUrl: './source-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceFormComponent extends EntityBaseFormComponent<IAgentSource> {
  protected entityCommunicationService = inject(SourceService);

  private fb = inject(FormBuilder);
  // private notionService = inject(NotionService);

  sourcesTypes = SourceTypeOptions;

  public form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    type: [''],
    content: [''],
    sourceUrl: [''],
    img: [''],
    tag: [''],
  });

  protected override patchForm(entity: IAgentSource): void {
    this.form.patchValue(entity);
  }

  async updateSource() {
    if (this.form.valid) {
      switch (this.form.value.type) {
        case SourceType.DOCUMENT:
          // await this.updateDocumentSource();
          break;
        case SourceType.WEBSITE:
          // await this.updateWebsiteSource();
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

  private async updateYoutubeSource() {
    // const youtubeUrl = this.form.controls.sourceUrl.value;
    // const transcript: any = await this.entityCommunicationService.getYoutubeContent(youtubeUrl as string);
    // this.form.patchValue({
    //   content: transcript.text,
    // });
  }

  private async updateNotionSource() {
    // const notionUrl = this.form.controls.sourceUrl.value;
    // const notionId = this.notionService.extractNotionPageId(notionUrl as string);
    // if (!notionId) {
    //   throw new Error('Notion ID not found');
    // }
    // const page = await this.notionService.getPageInSpecificFormat(notionId, NotionExportType.MARKDOWN);
    // this.toastService.success({
    //   title: 'Notion page fetched',
    //   subtitle: 'The notion page has been fetched successfully',
    // });
    // this.form.patchValue({
    //   content: page.content,
    // });
    // throw new Error('Not implemented');
  }

  public goToSourceDetail(sourceId: string) {
    this.router.navigate(['../../details', sourceId], { relativeTo: this.route });
  }
}
