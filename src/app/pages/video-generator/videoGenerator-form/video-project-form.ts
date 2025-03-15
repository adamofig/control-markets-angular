import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IOverlayPlan, IVideoProjectGenerator } from '../models/videoGenerators.model';
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
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { MarkdownModule } from 'ngx-markdown';

import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/ngx-core';
import { RVEComponent } from '../react-video-editor-generator/rve';
import { MarkdownPipe } from 'src/app/shared/pipes/markdown.pipe';
import { AsyncPipe } from '@angular/common';
import { VideoFragmentExtractorService } from './video-fragment-extractor.service';

@Component({
  selector: 'app-video-project-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    TextareaModule,
    DropdownModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    ChipModule,
    TooltipModule,
    CheckboxModule,
    FormsModule,
    TagModule,
    AccordionModule,
    RVEComponent,
    MarkdownModule,
    MarkdownPipe,
    AsyncPipe,
  ],
  templateUrl: './video-project-form.html',
  styleUrl: './video-project-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoProjectFormComponent implements OnInit {
  public instructions: string = '';

  public fragmentExtraction = {
    instructions: '',
    sourceId: '',
  };

  public videoGeneratorForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private videoGeneratorService: VideoGeneratorService,
    private fb: FormBuilder,
    private router: Router,
    private videoFragmentExtractorService: VideoFragmentExtractorService,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    private cdr: ChangeDetectorRef
  ) {}

  public videoProject: IVideoProjectGenerator | null = null;
  public videoGeneratorId = this.route.snapshot.params['id'];

  async ngOnInit(): Promise<void> {
    if (this.videoGeneratorId) {
      this.videoProject = await this.videoGeneratorService.getVideoGenerator(this.videoGeneratorId);
      if (this.videoProject) {
        console.log(this.videoProject);
        this.videoGeneratorForm.patchValue(this.videoProject);
      }
    }
  }

  async save() {
    if (this.videoGeneratorForm.valid) {
      const videoGenerator = { ...this.videoGeneratorForm.value, ...this.videoProject } as IVideoProjectGenerator;

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

  public addVideo() {
    const url = prompt('¿Estás seguro de querer agregar un video?');
    if (url) {
      console.log('');
    }
  }

  public async addSource() {
    const idSource = prompt('La fuente debe estar agregada en la sección de fuentes, copia el id');
    if (!idSource) {
      this.toastService.warn({ title: 'Error', subtitle: 'No se ha seleccionado ninguna fuente' });
      return;
    }

    const result: any = await this.videoGeneratorService.addSource(this.videoGeneratorId, idSource);
    console.log(result);
    this.videoProject = result;
    this.cdr.detectChanges();
    this.toastService.success({ title: 'Fuente agregada', subtitle: 'La fuente ha sido agregada correctamente' });
  }

  public async removeSource(source: any) {
    if (!source) {
      this.toastService.warn({ title: 'Error', subtitle: 'No se ha seleccionado ninguna fuente' });
      return;
    }

    const result = await this.videoGeneratorService.removeSource(this.videoGeneratorId, source.reference._id);
    this.videoProject = result;
    this.cdr.detectChanges();

    this.toastService.success({ title: 'Fuente eliminada', subtitle: 'La fuente ha sido eliminada correctamente' });
  }

  public extraction: any = null;

  public isLookingFragments = false;

  public goToSource(source: any) {
    this.router.navigate(['../../../sources/details', source.id], { relativeTo: this.route });
  }

  public async getBestFragments() {
    this.isLookingFragments = true;
    await this.videoFragmentExtractorService.getBestFragments(this.videoProject as IVideoProjectGenerator, this.fragmentExtraction);
    this.isLookingFragments = false;
  }
}
