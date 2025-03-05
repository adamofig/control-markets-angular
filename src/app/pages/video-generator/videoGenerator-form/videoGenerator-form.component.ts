import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IVideoGenerator } from '../models/videoGenerators.model';
import { VideoGeneratorService } from '../videoGenerators.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { TooltipModule } from 'primeng/tooltip';
import { AspectType, CropperComponentModal, CropImageSettings } from '@dataclouder/storage-uploader';

import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';

@Component({
  selector: 'app-source-form',
  imports: [ReactiveFormsModule, CardModule, TextareaModule, DropdownModule, ButtonModule, SelectModule, InputTextModule, ChipModule, TooltipModule],
  templateUrl: './videoGenerator-form.component.html',
  styleUrl: './videoGenerator-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoGeneratorFormComponent implements OnInit {
  // public imageSettings: CropImageSettings = {
  //   cropImageSettings: {
  //     resizeToWidth: 1024,
  //     path: 'testimonials',
  //     fileName: 'image',
  //   },

  //   ratioType: AspectType.Square,
  //   resolutions: [1024, 768],
  // };

  public videoGeneratorForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    type: [''],
    relation: [{ id: '', name: '', description: '' }],
  });

  public peopleOptions = [
    { id: '1', name: 'Yang Feng', description: 'Description with short description', image: 'assets/images/face-1.jpg' },
    { id: '2', name: 'Juan Perez', description: 'Description ', image: 'assets/images/face-2.jpg' },
    { id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/images/face-3.jpg' },
  ];

  public selectedPeople: any[] = [{ id: '3', name: 'John Doe', description: 'Description with short description', image: 'assets/images/face-3.jpg' }];

  public videoGeneratorTypes = [
    { label: 'Type 1', value: 'type1' },
    { label: 'Type 2', value: 'type2' },
    { label: 'Type 3', value: 'type3' },
  ];

  public relationObjects = [
    { id: 'Relation 1', name: 'relation1', description: 'Description with short description' },
    { id: 'Relation 2', name: 'relation2', description: 'Description with short description' },
    { id: 'Relation 3', name: 'relation3', description: 'Description with short description' },
  ];

  constructor(
    private route: ActivatedRoute,
    private videoGeneratorService: VideoGeneratorService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService
  ) {}

  public videoGenerator: IVideoGenerator | null = null;
  public videoGeneratorId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.videoGeneratorId) {
      this.videoGenerator = await this.videoGeneratorService.getVideoGenerator(this.videoGeneratorId);
      if (this.videoGenerator) {
        console.log(this.videoGenerator);
        this.videoGeneratorForm.patchValue(this.videoGenerator);
      }
    }
  }

  async save() {
    if (this.videoGeneratorForm.valid) {
      const videoGenerator = { ...this.videoGeneratorForm.value, ...this.videoGenerator } as IVideoGenerator;

      const result = await this.videoGeneratorService.saveVideoGenerator(videoGenerator);

      if (!this.videoGeneratorId) {
        this.router.navigate([result.id], { relativeTo: this.route });
      }
      this.toastService.success({
        title: 'Origen guardado',
        subtitle: 'El origen ha sido guardado correctamente',
      });
    }
  }

  public addItemToList(event: any) {
    this.selectedPeople.push(event.value);
  }

  public removeItemFromList(person: any) {
    this.selectedPeople = this.selectedPeople.filter(p => p.id !== person.id);
    console.log(this.selectedPeople);
  }

  public addVideo() {
    const url = prompt('¿Estás seguro de querer agregar un video?');
    if (url) {
      console.log('');
    }
  }
}
