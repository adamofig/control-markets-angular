import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrganization } from '../models/organizations.model';
import { OrganizationService } from '../organizations.service';
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
import { OrganizationListComponent } from '../organization-list/organization-list.component';

@Component({
  selector: 'app-organization-form',
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
    OrganizationListComponent,
  ],
  templateUrl: './organization-form.component.html',
  styleUrl: './organization-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrganizationFormComponent extends EntityBaseFormComponent<IOrganization> {
  protected entityCommunicationService = inject(OrganizationService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  public form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as FileStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
  });

  protected override patchForm(entity: IOrganization): void {
    // NOTE: you may need to custom patchForm if contains arrays or custom logic.
    this.form.patchValue(entity);
  }

  public storageImgSettings = {
    path: `organizations`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  extraFields: any[] = [
    { key: 'title', type: 'input', props: { label: 'Title', placeholder: 'Title', required: false } },
    { key: 'content', type: 'textarea', props: { label: 'Content', placeholder: 'Content', required: false } },
  ];

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'assets/defaults/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'assets/defaults/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/defaults/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/defaults/images/face-3.jpg' }];

  public types = [
    { label: 'Personal', value: 'personal' },
    { label: 'Company', value: 'company' },
  ];

  public relationObjects = [
    { id: 'Relation 1', name: 'relation1', description: 'Description with short description' },
    { id: 'Relation 2', name: 'relation2', description: 'Description with short description' },
    { id: 'Relation 3', name: 'relation3', description: 'Description with short description' },
  ];

  public addItemToList(event: any) {
    this.selectedPeople.push(event.value);
  }

  public removeItemFromList(person: any) {
    this.selectedPeople = this.selectedPeople.filter(p => p.id !== person.id);
    console.log(this.selectedPeople);
  }

  public handleImageUpload(event: any) {
    // this.organizationForm.patchValue({ image: event });
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

  public handleRelationSelection(relation: IOrganization) {
    console.log(relation);

    // this.organizationForm.patchValue({ relation: relation });
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    alert('Relation selected');
  }
  public async addUser(email: string) {
    if (!this.entityId() || !email) {
      return;
    }
    await this.entityCommunicationService.addUserToOrganization(this.entityId(), email);
    this.entity.update(entity => {
      if (!entity.guests) {
        entity.guests = [];
      }
      entity.guests.push({ id: '', name: '', email });
      return { ...entity };
    });
  }
}
