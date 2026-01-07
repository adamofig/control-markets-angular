import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { StatusJob } from '../../models/flows.model';
import { ButtonModule } from 'primeng/button';
import { FlowOrchestrationService } from '../../services/flow-orchestration.service';
import { BaseFlowNode } from '../base-flow-node';
import { INodeVideoGenerationData } from '../../models/nodes.model';
import { INodeConfig, NodeCompTypeStr } from '../../models/flows.model';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IAssetsGeneration, IGeneratedAsset, GeneratedAssetsService } from '@dataclouder/ngx-ai-services';
import { SelectModule } from 'primeng/select';
import { CounterComponent } from '../../../../components/counter/counter.component';
import { DialogService } from 'primeng/dynamicdialog';
import { VideoGenDetailsComponent } from './video-gen-details/video-gen-details';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { ActionsToolbarComponent } from '../actions-toolbar/actions-toolbar.component';
import { ToastAlertService } from 'src/app/services/toast.service';

export interface CustomVideoGenNode extends ComponentDynamicNode {
  data?: any;
  config: INodeConfig;
  nodeData: INodeVideoGenerationData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './video-gen-node.html',
  styleUrls: ['./video-gen-node.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HandleComponent,
    ButtonModule,
    TagModule,
    TextareaModule,
    FormsModule,
    SelectModule,
    ReactiveFormsModule,
    CounterComponent,
    BaseNodeToolbarComponent,
    ActionsToolbarComponent,
  ],
})
export class VideoGenNodeComponent extends BaseFlowNode<CustomVideoGenNode> implements OnInit, OnDestroy {
  public flowOrchestrationService = inject(FlowOrchestrationService);
  private generatedAssetsService = inject(GeneratedAssetsService);
  private toastAlertService = inject(ToastAlertService);

  public fb = inject(FormBuilder);


  runNode(): void {
    this.flowOrchestrationService.runNode(this.flowDiagramStateService.getFlow()?.id!, this.node().id);
  }

  async directEndPoint(): Promise<void> {
    this.statusJob.set(StatusJob.IN_PROGRESS);

    try {
      const inputNodes = this.nodeSearchesService.getInputNodes(this.node().id);
      let assets = { firstFrame: null };
      for (const inputNode of inputNodes) {
        const nodeDataVal = inputNode.data;
        if (nodeDataVal?.config?.component === NodeCompTypeStr.AssetsNodeComponent) {
          assets.firstFrame = (nodeDataVal as any).nodeData?.storage;
          break;
        }
      }
      if (assets.firstFrame === null) {
        this.toastAlertService.warn({ title: 'Se requiere connectar una imagen', subtitle: 'Intenta cargar una imagen primero. ' });
        return;
      }

      const genAssetObj: Partial<IGeneratedAsset> = {
        prompt: this.nodeData()?.prompt,
        request: this.nodeData()?.request,
        assets: assets as unknown as IAssetsGeneration,
        provider: this.nodeData()?.provider as 'comfy' | 'vertex',
      };

      const asset = await this.generatedAssetsService.createOrUpdate(genAssetObj);
      // Revisar que este conectado al 3001.
      const assetGenerated: any = await this.generatedAssetsService.generateVideoFromAsset(asset.id);

      this.flowSignalNodeStateService.createConnectedAssetGeneratedNode(assetGenerated, inputNodes[0].id, this.node().id);
      this.statusJob.set(StatusJob.COMPLETED);
      this.flowOrchestrationService.saveFlow();
    } catch (error) {
      this.statusJob.set(StatusJob.FAILED);
      console.error(error);
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  openModal(): void {
    console.log(this.selected());
    this.dialogService.open(VideoGenDetailsComponent, {
      header: 'Video Gen Node Details',
      modal: false,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      data: this.node(),
      width: '450px',
    });
  }
  handleActionsToolbarEvents(event: 'runNode' | 'runEndPoint'): void {
    switch (event) {
      case 'runNode':
        this.runNode();
        break;
      case 'runEndPoint':
        this.directEndPoint();
        break;
    }
  }
}
