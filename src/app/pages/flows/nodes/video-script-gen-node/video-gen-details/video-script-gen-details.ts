import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';
import { IVideoScriptGenNodeData } from '../../../models/nodes.model';
import { DialogsComponent } from '../../../../video-projects-gen/dialogs/dialogs.component';
import { NodeSearchesService } from '../../../services/node-searches.service';
import { DynamicNodeWithData } from '../../../services/flow-diagram-state.service';
import { LlmService } from '@dataclouder/ngx-ai-services';


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
  private cdr = inject(ChangeDetectorRef);

  public node!: DynamicNodeWithData;
  public form!: FormGroup;
  public inputNodes: DynamicNodeWithData[] = [];
  public isLoading = false;

  constructor() {
    this.node = this.dynamicDialogConfig.data as DynamicNodeWithData;
    this.initForm();
    this.loadInputNodes();
  }

  private loadInputNodes(): void {
    if (this.node?.id) {
      this.inputNodes = this.nodeSearchesService.getInputNodes(this.node.id);
    }
  }

  private initForm(): void {
    const nodeData = this.node?.data?.nodeData;
    this.form = this.fb.group({
      prompt: [nodeData?.prompt || ''],
      script: [nodeData?.script || ''],
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

  public async generateScript(): Promise<void> {
    const inputContent = this.inputNodes
      .map(n => `Source (${n.config?.label || 'Unknown'}): ${n.data?.nodeData?.content || ''}`)
      .join('\n\n');

    if (!inputContent && !this.form.value.prompt) {
      console.warn('No input content or prompt provided for script generation.');
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
