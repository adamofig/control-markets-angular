import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILead } from '../models/leads.model';
import { LeadService } from '../leads.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, FileStorageData } from '@dataclouder/ngx-cloud-storage';

import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { DialogModule } from 'primeng/dialog';
import { LeadListComponent } from '../lead-list/lead-list.component';

@Component({
  selector: 'app-source-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    TextareaModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CropperComponentModal,
    DialogModule,
    LeadListComponent,
  ],
  templateUrl: './lead-form.component.html',
  styleUrl: './lead-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LeadFormComponent extends EntityBaseFormComponent<ILead> implements OnInit {
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  protected entityCommunicationService = inject(LeadService);
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as FileStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
  });

  protected override patchForm(entity: ILead): void {
    // NOTE: you may need to custom patchForm if contains arrays or custom logic.
    this.form.patchValue(entity);
  }

  public handleImageUpload(event: any) {
    // this.leadForm.patchValue({ image: event });
    alert('Image uploaded');
  }

  public searchRelation() {
    alert('Search relation');
  }

  public isDialogVisible = false;

  public relationPopupSelector: any[] = [];

  public removeRelationFromList(relation: any) {
    this.relationPopupSelector = this.relationPopupSelector.filter(r => r.id !== relation.id);
    console.log(this.relationPopupSelector);
  }

  public handleRelationSelection(relation: ILead) {
    console.log(relation);

    // this.leadForm.patchValue({ relation: relation });
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    alert('Relation selected');
  }

  public async extractNumberInformation() {
    alert('Extract number information');
    const testNumber = '+52 945 123 456';
    const content = await this.leadService.extractNumberInformation(testNumber);

    const response = await this.entityCommunicationService.partialUpdate(this.entity()?.id, { phoneNumberData: content });

    console.log(response);
  }

  public async processPhoneExtractionAll() {
    // 1)
    this.leadService.startPhoneExtractionAll();
  }
}
