import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAgentJob } from '../models/jobs.model';
import { JobService } from '../jobs.service';
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

import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { DialogModule } from 'primeng/dialog';
import { JobListComponent } from '../job-list/job-list.component';

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
    JobListComponent,
  ],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class JobFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject<ToastAlertsAbstractService>(TOAST_ALERTS_TOKEN);
  private cdr = inject(ChangeDetectorRef);

  public storageImgSettings = {
    path: `jobs`,
    cropSettings: { aspectRatio: AspectType.Square, resolutions: [ResolutionType.MediumLarge], resizeToWidth: 700 },
  };

  extraFields: FormlyFieldConfig[] = [
    { key: 'title', type: 'input', props: { label: 'Title', placeholder: 'Title', required: false } },
    { key: 'content', type: 'textarea', props: { label: 'Content', placeholder: 'Content', required: false } },
  ];

  public jobForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    image: [{} as CloudStorageData],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
    extension: new FormGroup({}),
  });

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'assets/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'assets/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/images/face-3.jpg' }];

  public jobTypes = [
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
    { label: 'Type 3', value: 'type3' },
  ];

  public relationObjects = [
    { id: 'Relation 1', name: 'relation1', description: 'Description with short description' },
    { id: 'Relation 2', name: 'relation2', description: 'Description with short description' },
    { id: 'Relation 3', name: 'relation3', description: 'Description with short description' },
  ];

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  public job: IAgentJob | null = null;
  public jobId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.jobId) {
      this.job = await this.jobService.getJob(this.jobId);
      if (this.job) {
        // this.jobForm.patchValue({
        //   name: this.job.task.name,
        //   description: this.job.response.content,
        //   image: this.job.task.assets.image,
        //   type: this.job.task.type,
        //   relation: {},
        //   extension: {},
        // });
      }
    }
  }

  async save() {
    if (this.jobForm.valid) {
      const job = { ...this.job, ...this.jobForm.value } as IAgentJob;

      const result = await this.jobService.saveJob(job);

      if (!this.jobId) {
        this.router.navigate([result.id], { relativeTo: this.route });
      }
      this.toastService.success({ title: 'Origen guardado', subtitle: 'El origen ha sido guardado correctamente' });
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
    // this.jobForm.patchValue({ image: event });
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

  public handleRelationSelection(relation: any) {
    console.log(relation);

    // this.jobForm.patchValue({ relation: relation });
    this.isDialogVisible = false;
    this.relationPopupSelector.push(relation);
    this.cdr.detectChanges();
    alert('Relation selected');
  }
}
