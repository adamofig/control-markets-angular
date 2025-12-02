import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Vflow } from 'ngx-vflow';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IAgentTask } from 'src/app/pages/tasks/models/tasks-models';
import { TaskDetailsComponent } from 'src/app/pages/tasks/task-details/task-details.component';
import { DynamicNodeWithData, FlowDiagramStateService } from 'src/app/pages/flows/services/flow-diagram-state.service';
import { ComfyVideoOptionsRequestFormComponent } from '@dataclouder/ngx-ai-services';
import { SelectModule } from 'primeng/select';
import { NodeCategory, StatusJob } from '../../../models/flows.model';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { NodeSearchesService } from '../../../services/node-searches.service';
import { FlowSignalNodeStateService } from '../../../services/flow-signal-node-state.service';

@Component({
  selector: 'app-video-gen-details',
  imports: [
    Vflow,
    DialogModule,
    TaskDetailsComponent,
    ComfyVideoOptionsRequestFormComponent,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TagModule,
    TextareaModule,
  ],
  templateUrl: './video-gen-details.html',
  styleUrl: './video-gen-details.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoGenDetailsComponent implements OnInit {
  public dynamicDialogConfig = inject(DynamicDialogConfig);
  public dynamicDialogRef = inject(DynamicDialogRef);
  public flowDiagramStateService = inject(FlowDiagramStateService);
  private nodeSearchesService = inject(NodeSearchesService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  public node!: any;
  public agentTask!: IAgentTask;
  public prompt = 'Describe your idea';

  public fb = inject(FormBuilder);

  public task: any | null = null;
  public connectedNodes!: DynamicNodeWithData[];

  public statusJob = StatusJob;

  public nodeCategory: NodeCategory = NodeCategory.PROCESS;

  public formValue = 'Éste es el valor';

  public form = this.fb.group({
    seconds: [2],
    width: [300],
    height: [576],
  });

  public providerForm = this.fb.control('comfy');

  public providers = [
    { label: 'Comfy', value: 'comfy' },
    { label: 'Veo', value: 'veo' },
  ];

  constructor() {
    this.node = this.dynamicDialogConfig.data;
    this.agentTask = this.node?.data?.agentTask;
  }

  ngOnInit(): void {
    this.connectedNodes = this.nodeSearchesService.getInputNodes(this.node?.id);
    if (this.node?.data?.nodeData) {
      this.prompt = this.node.data.nodeData.prompt;
      this.providerForm.setValue(this.node.data.nodeData.provider);
      this.form.setValue(this.node.data.nodeData.request);
    }
  }

  public save(): void {
    const prompt = this.prompt;
    const provider = this.providerForm.value;
    const request = this.form.value;

    if (this.node?.data?.nodeData) {
      this.node.data.nodeData = {
        prompt,
        provider,
        request,
      };
    } else {
      this.node.data = {
        nodeData: {
          prompt,
          provider,
          request,
        },
      };
    }
    console.log(this.node);

    this.flowSignalNodeStateService.updateNodeData(this.node.id, this.node.data);
    console.log(this.flowSignalNodeStateService.nodes());
    this.dynamicDialogRef.close();
  }
}
