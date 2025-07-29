import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ICompositionPlan, IFragmentExtraction, IVideoProjectGenerator, SourceWithReference } from '../models/video-project.model';
import { VideoGeneratorService } from '../services/video-project-gen.service';
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

import { VideoFragmentExtractorService } from '../services/video-fragment-extractor.service';
import { CompositionEditorComponent } from '../composition-editor-adapter/composition-editor-adapter';
import { IAgentSource } from '../../sources/models/sources.model';
import { downloadVideoSourceAsComposition } from '../composition-editor-adapter/overlay-download.util';
import { TimeLineManager } from '../timeline/timeline-manager/timeline-manager';
import { TaskListComponent } from '../../tasks/task-list/task-list.component';
import { DialogModule } from 'primeng/dialog';

import { AgentCardListComponent } from '@dataclouder/ngx-agent-cards';
import { DialogsComponent } from '../dialogs/dialogs.component';

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
    CompositionEditorComponent,
    MarkdownModule,
    TimeLineManager,
    // TaskListComponent,
    DialogModule,
    AgentCardListComponent,
    DialogsComponent,
  ],
  templateUrl: './video-project-form.html',
  styleUrl: './video-project-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoProjectFormComponent implements OnInit {
  public instructions: string = '';

  public dialogsForm: FormArray = this.fb.array([] as any[]);

  public showTaksDetails = false;

  public showAgentDetails = false;

  public fragmentExtraction = {
    instructions: '',
    selectedSourceId: '',
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

  public async manualExtractFragments() {
    const compositionPlan: ICompositionPlan = { overlays: [] };
    const duration = this.videoProject?.sources?.find(s => s.id === this.fragmentExtraction.selectedSourceId)?.reference?.video?.transcription?.duration || 0;

    const fragment: IFragmentExtraction = { startSec: 0, endSec: duration, durationSec: duration };
    compositionPlan.overlays.push({
      type: 'video',
      sourceId: this.fragmentExtraction.selectedSourceId,
      timelineStartSec: 0,
      timelineEndSec: 0,
      fragment,
      fragments: [fragment],
    });
    this.videoProject!.compositionPlan = compositionPlan;
    await this.videoGeneratorService.saveVideoGenerator(this.videoProject as IVideoProjectGenerator);
    this.toastService.success({ title: 'Fragmentos manualmente extraídos', subtitle: 'Los fragmentos han sido extraídos correctamente' });
    this.cdr.detectChanges();
  }

  public async getAndSaveBestFragments() {
    this.isLookingFragments = true;

    const result = await this.videoFragmentExtractorService.getAndSaveBestFragments(this.videoProject as IVideoProjectGenerator, {
      instructions: this.fragmentExtraction.instructions,
      sourceId: this.fragmentExtraction.selectedSourceId,
    });
    if (result) {
      // TODO: update the project with the new fragment extraction
      this.videoProject!.compositionPlan = result.compositionPlan;
      console.log('result', result);
      this.toastService.success({ title: 'Fragmentos encontrados', subtitle: 'Los fragmentos han sido encontrados correctamente' });
      this.cdr.detectChanges();
    } else {
      this.toastService.error({ title: 'Error', subtitle: 'No se ha encontrado ningún fragmento' });
    }
    this.isLookingFragments = false;
    this.cdr.detectChanges();
  }

  public async downloadComposition(source: SourceWithReference) {
    if (!source.reference) {
      this.toastService.warn({ title: 'Error', subtitle: 'No se ha seleccionado ninguna fuente' });
      return;
    }

    const compositionPlan: ICompositionPlan = this.videoFragmentExtractorService.getVideoFullFragment(source.reference as IAgentSource);

    downloadVideoSourceAsComposition(source.reference as IAgentSource, compositionPlan!);
    alert('Working on this...');
    console.log('source', source.reference?.video);

    this.toastService.success({ title: 'Composición descargada', subtitle: 'La composición ha sido descargada correctamente' });
  }

  public async selectAgent(agent: any) {
    this.showAgentDetails = false;
    this.videoProject!.agent = agent;

    await this.videoGeneratorService.addAgent(this.videoProject!.id, agent._id);
    this.cdr.detectChanges();
    console.log('agent', agent);
  }

  public selectTask(task: any) {
    this.showTaksDetails = false;
    this.videoProject!.task = task;
    this.cdr.detectChanges();
  }

  public saveDialogs() {
    this.videoProject!.dialogs = this.dialogsForm.value;

    this.videoGeneratorService.updateVideoGenerator(this.videoGeneratorId, { dialogs: this.videoProject!.dialogs });
    this.cdr.detectChanges();
    this.toastService.success({ title: 'Diálogos guardados', subtitle: 'Los diálogos han sido guardados correctamente' });
  }
}
