import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';


import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';
import { IVideoScriptGenNodeData } from '../../../models/nodes.model';
import { DialogsComponent } from '../../../../video-projects-gen/dialogs/dialogs.component';
import { NodeSearchesService } from '../../../services/node-searches.service';
import { DynamicNodeWithData } from '../../../services/flow-diagram-state.service';
import { LlmService, TtsService, TTSRequest, AudioSpeed } from '@dataclouder/ngx-ai-services';
import { NodeCompTypeStr } from '../../../models/flows.model';


/**
 * Component for managing the details and generation of video scripts.
 * It handles aggregating content from multiple input nodes, generating scripts via LLM,
 * and synthesizing audio for dialogs using connected TTS nodes.
 */
@Component({
  selector: 'app-video-script-gen-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TextareaModule,
    DialogsComponent,
    ToggleSwitchModule,
  ],
  templateUrl: './video-script-gen-details.html',
  styleUrl: './video-script-gen-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoScriptGenDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public dynamicDialogRef = inject(DynamicDialogRef);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  private nodeSearchesService = inject(NodeSearchesService);
  private fb = inject(FormBuilder);
  private llmService = inject(LlmService);
  private ttsService = inject(TtsService);
  private cdr = inject(ChangeDetectorRef);

  public node!: DynamicNodeWithData;
  public form!: FormGroup;
  public inputNodes: DynamicNodeWithData[] = [];
  public hasAudioTtsInput = false;
  public hasInputContent = false;
  public isLoading = false;
  public isGeneratingAudio = false;

  constructor() {
    this.node = this.dynamicDialogConfig.data as DynamicNodeWithData;
    this.initForm();
    this.loadInputNodes();
  }

  /**
   * Iterates through all dialogs and generates audio for those that don't have it yet.
   * It requires a connected Audio TTS node to fetch voice and storage settings.
   */
  public async generateAudio(): Promise<void> {
    const ttsNode = this.nodeSearchesService.getFirstInputNodeOfType(this.node.id, NodeCompTypeStr.AudioTTsNodeComponent);
    if (!ttsNode) {
      console.warn('No Audio TTS node connected as input.');
      return;
    }

    const ttsSettings = ttsNode.data?.nodeData?.settings;
    if (!ttsSettings) {
      console.warn('Audio TTS node has no settings.');
      return;
    }

    const dialogs = this.dialogsFormArray.controls;
    this.isGeneratingAudio = true;

    try {
      for (const dialogGroup of dialogs as FormGroup[]) {
        const audio = dialogGroup.get('audio')?.value;
        const content = dialogGroup.get('content')?.value;

        if (!audio && content) {
          const request: TTSRequest = {
            text: content,
            voice: ttsSettings.voice || 'en-US-Standard-C',
            generateTranscription: true,
            speedRate: ttsSettings.speedRate || 1.0,
            speed: ttsSettings.speed || AudioSpeed.Regular,
            path: ttsSettings.storagePath || `flows/audios/${this.node.id}`
          };

          const audioStorage = await this.ttsService.synthesizeAndUpload(request);
          
          if (audioStorage) {
            dialogGroup.get('audio')?.patchValue(audioStorage);
            if (audioStorage.transcription) {
              dialogGroup.get('transcription')?.patchValue(audioStorage.transcription);
            }
          }
          this.cdr.detectChanges();
        }
      }
    } catch (error) {
      console.error('Audio generation failed:', error);
    } finally {
      this.isGeneratingAudio = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * Loads and identifies connected input nodes to extract context for script generation.
   * Also checks for the presence of specialized nodes like Audio TTS.
   */
  private loadInputNodes(): void {
    if (this.node?.id) {
      this.inputNodes = this.nodeSearchesService.getInputNodes(this.node.id);
      this.hasAudioTtsInput = this.inputNodes.some(n => n.config?.component === NodeCompTypeStr.AudioTTsNodeComponent);
      this.hasInputContent = this.inputNodes.some(n => !!this.getInputContent(n));
    }
  }

  public getInputContent(node: DynamicNodeWithData): string {
    return node.data?.nodeData?.content || node.data?.nodeData?.response?.content || '';
  }

  private initForm(): void {
    const nodeData = this.node?.data?.nodeData;
    this.form = this.fb.group({
      prompt: [nodeData?.prompt || ''],
      useAudioTts: [nodeData?.useAudioTts || false],
      dialogs: this.fb.array([]),
    });
  }

  get dialogsFormArray(): any {
    return this.form.get('dialogs');
  }

  ngOnInit(): void {
    // Current data is handled in initForm which is called in constructor
    // If needed updates from node.data.nodeData could be added here.
  }

  /**
   * Aggregates content from all input nodes and custom prompt to generate a new script.
   * Uses LlmService to produce a structured JSON array of IDialog objects.
   */
  public async generateScript(): Promise<void> {
    const inputContent = this.inputNodes
      .map(n => `Source (${n.config?.label || 'Unknown'}): ${this.getInputContent(n)}`)
      .join('\n\n');

    if (!inputContent) {
      console.warn('No input content provided for script generation.');
      return;
    }

    this.isLoading = true;

    const instructions = `
    Create a video script based on the provided information. 
    The script should be engaging, informative, and formatted as a series of dialogs.
    Each dialog must have a clear 'content' that translates well to speech.

    Current Prompt/Goal: ${this.form.value.prompt || 'Generate a compelling video script.'}

    
    Source Information:
    ${inputContent}
    `;

    const jsonStructure = `
    Return the result in the following JSON structure:
    [
      {
        "content": "string" // The actual text to be spoken
      }
    ]
    `;

    const prompt = `
    Your Task is:
    ${instructions}

    ${jsonStructure}
    
    IMPORTANT: Provide ONLY the JSON array. Do not include markdown code blocks.
    `;

    try {
      const response = await this.llmService.callChatCompletion({
        messages: [{ role: 'user', content: prompt }],
        returnJson: true,
      });

      let result: any;
      if (typeof response.content === 'string') {
        result = JSON.parse(response.content);
      } else {
        result = response.content;
      }

      if (Array.isArray(result)) {
        this.populateDialogs(result);
      } else if (result && (result as any).dialogs) {
        // Handle case where AI might wrap it in an object
        this.populateDialogs((result as any).dialogs);
      }

    } catch (error) {
      console.error('AI Generation failed:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private populateDialogs(dialogs: any[]): void {
    const dialogsArray = this.dialogsFormArray;
    dialogsArray.clear();
    
    dialogs.forEach(d => {
      dialogsArray.push(this.fb.group({
        content: [d.content || ''],
        audio: [null],
        voice: [''],
        transcription: [null],
        captions: [null]
      }));
    });
  }

  public save(): void {
    const nodeData: IVideoScriptGenNodeData = {
      ...this.node.data?.nodeData,
      ...this.form.value,
    };

    this.flowSignalNodeStateService.updateNodeData(this.node.id, {
        ...this.node.data,
        nodeData
    });
    
    this.dynamicDialogRef.close();
  }

  public cancel(): void {
    this.dynamicDialogRef.close();
  }
}
