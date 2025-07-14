import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDeckCommander } from '../models/deck-commanders.model';
import { DeckCommanderService } from '../deck-commanders.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, ResolutionType, CloudStorageData } from '@dataclouder/ngx-cloud-storage';

import { EntityBaseFormComponent } from '@dataclouder/ngx-core';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { DialogModule } from 'primeng/dialog';
import { DeckCommanderListComponent } from '../deck-commander-list/deck-commander-list.component';

@Component({
  selector: 'app-source-form',
  imports: [
    ReactiveFormsModule,
    CardModule,
    TextareaModule,
    DropdownModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CropperComponentModal,
    FormlyModule,
    DialogModule,
    DeckCommanderListComponent,
  ],
  templateUrl: './deck-commander-form.component.html',
  styleUrl: './deck-commander-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DeckCommanderFormComponent extends EntityBaseFormComponent<IDeckCommander> implements OnInit {
  protected entityCommunicationService = inject(DeckCommanderService);
  private fb = inject(FormBuilder);

  public form: FormGroup = this.fb.group({});

  protected override patchForm(entity: IDeckCommander): void {
    throw new Error('Method not implemented.');
  }
  private DeckCommanderService = inject(DeckCommanderService);
  private cdr = inject(ChangeDetectorRef);

  public storageImgSettings = {
    path: `DeckCommanders`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  extraFields: FormlyFieldConfig[] = [
    { key: 'title', type: 'input', props: { label: 'Title', placeholder: 'Title', required: false } },
    { key: 'content', type: 'textarea', props: { label: 'Content', placeholder: 'Content', required: false } },
  ];

  public DeckCommanderForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as CloudStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
    extension: new FormGroup({}),
  });

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'assets/defaults/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'assets/defaults/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/defaults/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/defaults/images/face-3.jpg' }];

  public DeckCommanderTypes = [
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
    { label: 'Type 3', value: 'type3' },
  ];

  public relationObjects = [
    { id: 'Relation 1', name: 'relation1', description: 'Description with short description' },
    { id: 'Relation 2', name: 'relation2', description: 'Description with short description' },
    { id: 'Relation 3', name: 'relation3', description: 'Description with short description' },
  ];

  public DeckCommander: IDeckCommander | null = null;
  public DeckCommanderId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.DeckCommanderId) {
      this.DeckCommander = await this.DeckCommanderService.getDeckCommander(this.DeckCommanderId);
      if (this.DeckCommander) {
        this.DeckCommanderForm.patchValue(this.DeckCommander);
      }
    }
  }

  public addItemToList(event: any) {
    this.selectedPeople.push(event.value);
  }

  public removeItemFromList(person: any) {
    this.selectedPeople = this.selectedPeople.filter(p => p.id !== person.id);
    console.log(this.selectedPeople);
  }

  public handleImageUpload(event: any) {
    // this.DeckCommanderForm.patchValue({ image: event });
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

  public handleRelationSelection(relation: IDeckCommander) {
    console.log(relation);

    // this.DeckCommanderForm.patchValue({ relation: relation });
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    this.cdr.detectChanges();
    alert('Relation selected');
  }
}
