import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
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
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';

import { TOAST_ALERTS_TOKEN, ToastAlertsAbstractService } from '@dataclouder/core-components';
import { RVEComponent } from '../react-video-editor-generator/rve';

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
  ],
  templateUrl: './video-project-form.html',
  styleUrl: './video-project-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoProjectFormComponent implements OnInit {
  public instructions: string = '';

  public videoGeneratorForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private videoGeneratorService: VideoGeneratorService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(TOAST_ALERTS_TOKEN) private toastService: ToastAlertsAbstractService,
    private cdr: ChangeDetectorRef
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
    this.videoGenerator = result;
    this.cdr.detectChanges();
    this.toastService.success({ title: 'Fuente agregada', subtitle: 'La fuente ha sido agregada correctamente' });
  }

  public async removeSource(source: any) {
    if (!source) {
      this.toastService.warn({ title: 'Error', subtitle: 'No se ha seleccionado ninguna fuente' });
      return;
    }

    const result = await this.videoGeneratorService.removeSource(this.videoGeneratorId, source.reference._id);
    this.videoGenerator = result;
    this.cdr.detectChanges();

    this.toastService.success({ title: 'Fuente eliminada', subtitle: 'La fuente ha sido eliminada correctamente' });
  }

  public extraction: any = null;

  public isLookingFragments = false;
  public async getBestFragments() {
    this.isLookingFragments = true;
    const BestFragmentDefinition = `
    interface BestFragment {
      start: string;                      // Second where the video should start
      end: string;                        // Second where the video should end
      reason: string;                     // Reason why you choose this part
      suggestions: string;                // Any suggestions for visual elements or effects to enhance the segment
    }`;

    let instructions =
      'I have a transcription from an audio file. Please analyze the following segments and identify the most viral-worthy parts for a TikTok video:';

    let transcriptionJson = '';
    if (this.videoGenerator?.sources?.length) {
      const transcription = this.videoGenerator?.sources[0]?.reference?.video?.transcription;
      const segments = transcription.segments.map((segment: any) => {
        return { start: segment.start, end: segment.end, text: segment.text };
      });

      transcriptionJson += '```json\n' + JSON.stringify(segments) + '\n```';
    }

    instructions += `
${transcriptionJson}


Please tell me a range of video time that would make the most engaging TikTok content and explain why they would be effective. The ideal segments should:
1. Be catchy and memorable
2. The total time should be between 20-60 seconds in length combine adjacent segments to make a longer video
3. Contain complete thoughts or phrases
4. Have emotional impact or humor
5. Feature clear speech with minimal background noise

For the selected segment or combination, please provide:
- The total start and end times 
- A reason Why it would be effective for TikTok
- Any suggestions for visual elements or effects to enhance the segment
    `;

    instructions += `\n\nIMPORTANT: You must return only the JSON in the next format: ${BestFragmentDefinition}`;

    console.log(instructions);
    // TODO: pass transcription here.
    const result = await this.videoGeneratorService.getBestFragments(instructions);

    console.log(result.content);
    this.extraction = extractJsonFromResponse(result.content);
    if (!this.extraction) {
      this.toastService.error({ title: 'Try again', subtitle: 'Error Getting a response or parsing JSON' });
      return;
    } else {
      this.extraction.instructions = instructions;
      this.toastService.success({ title: 'Success', subtitle: 'Extraction done' });
    }
    console.log(this.extraction);
    if (!this.videoGenerator?.plan) {
      (this.videoGenerator as any).plan = {};
    }
    (this.videoGenerator?.plan as any).extraction = this.extraction;
    const response = await this.videoGeneratorService.saveVideoGenerator(this.videoGenerator as IVideoGenerator);
    console.log('response', response, 'saving ', this.videoGenerator);
    this.isLookingFragments = false;
    this.cdr.detectChanges();
    // console.log(result);
    // console.log(result);
  }
}

export function extractJsonFromResponse(content: string): any {
  const jsonMatch = content.match(/\{[\s\S]*?\}/); // Match everything between first { and }
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}
