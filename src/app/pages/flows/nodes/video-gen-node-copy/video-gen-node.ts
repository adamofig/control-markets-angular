import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { NodeCategory, StatusJob } from '../../models/flows.model';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { BaseFlowNode } from '../base-flow-node';
import { INodeVideoGenerationData } from '../../models/nodes.model';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComfyVideoOptionsRequestFormComponent, IAssetsGeneration, IGeneratedAsset } from '@dataclouder/ngx-vertex';
import { SelectModule } from 'primeng/select';
import { GeneratedAssetsService } from '@dataclouder/ngx-vertex';
import { NodeSearchesService } from '../../services/node-searches.service';
import { FlowSignalNodeStateService } from '../../services/flow-signal-node-state.service';
import { CounterComponent } from '../../../../components/counter/counter.component';

export interface CustomAssetsNode extends ComponentDynamicNode {
  nodeData: INodeVideoGenerationData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './video-gen-node.html',
  styleUrls: ['./video-gen-node.scss'],
  standalone: true,
  imports: [
    HandleComponent,
    ProgressSpinner,
    ButtonModule,
    TagModule,
    TextareaModule,
    FormsModule,
    ComfyVideoOptionsRequestFormComponent,
    SelectModule,
    ReactiveFormsModule,
    CounterComponent,
  ],
})
export class VideoGenNodeComponent extends BaseFlowNode<CustomAssetsNode> implements OnInit, OnDestroy {
  public flowOrchestrationService = inject(FlowOrchestrationService);
  private generatedAssetsService = inject(GeneratedAssetsService);
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);

  public fb = inject(FormBuilder);

  public override nodeCategory: NodeCategory = NodeCategory.PROCESS;

  public formValue = 'Éste es el valor';
  public status = signal<'loading' | 'error' | 'success' | 'idle'>('idle');

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

  // public prompt = this.node()?.data?.nodeData?.prompt || 'Describe your idea';
  public prompt = 'Describe your idea';

  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }

  async directEndPoint(): Promise<void> {
    this.status.set('loading');

    try {
      // this.flowExecutionStateService.getExecutionState()?.jobId
      // this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);

      const inputNodes = this.nodeSearchesService.getInputNodes(this.node().id);
      let assets = { firstFrame: null };
      for (const inputNode of inputNodes) {
        if (inputNode.component === 'AssetsNodeComponent') {
          assets.firstFrame = inputNode.data.nodeData.storage;
          break;
        }
      }

      const genAssetObj: Partial<IGeneratedAsset> = {
        prompt: this.prompt,
        request: this.form.value,
        assets: assets as unknown as IAssetsGeneration,
        provider: 'comfy',
      };

      const asset = await this.generatedAssetsService.createOrUpdate(genAssetObj);
      // Revisar que este conectado al 3001.
      const assetGenerated: any = await this.generatedAssetsService.generateVideoFromAsset(asset.id);

      this.flowSignalNodeStateService.createConnectedAssetGeneratedNode(assetGenerated, inputNodes[0].id, this.node().id);
      this.status.set('success');
    } catch (error) {
      this.status.set('error');
      console.error(error);
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.prompt = this.node()?.data?.nodeData?.prompt || 'Describe your idea';
    if (this.node()?.data?.nodeData?.request) {
      this.form.setValue(this.node()?.data?.nodeData?.request || {});
    }
    this.providerForm.setValue(this.node()?.data?.nodeData?.provider || 'comfy');
  }
}
