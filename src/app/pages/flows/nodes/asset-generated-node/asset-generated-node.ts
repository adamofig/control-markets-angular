import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, effect, inject, signal } from '@angular/core';
import { ComponentDynamicNode, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { AssetGeneratedDetailsComponent } from './asset-generated-details/asset-generated-details';
import { ResponseFormat } from 'src/app/pages/jobs/models/jobs.model';
import { ButtonModule } from 'primeng/button';
import { CommonModule, JsonPipe } from '@angular/common';
import { IGeneratedAsset, GeneratedAssetsService } from '@dataclouder/ngx-ai-services';
import { BaseFlowNode } from '../base-flow-node';
import { ActionsToolbarComponent } from '../actions-toolbar/actions-toolbar.component';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { TagModule } from 'primeng/tag';

export interface CustomAssetGeneratedNode extends ComponentDynamicNode {
  nodeData: IGeneratedAsset | null;
}

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow, DialogModule, ButtonModule, JsonPipe, BaseNodeToolbarComponent, ActionsToolbarComponent, CommonModule, TagModule],
  templateUrl: './asset-generated-node.html',
  styleUrl: './asset-generated-node.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AssetGeneratedNodeComponent extends BaseFlowNode<CustomAssetGeneratedNode> {
  public dialogService = inject(DialogService);
  public generatedAssetsService = inject(GeneratedAssetsService);

  public generatedAsset: IGeneratedAsset | null = null;
  public responseFormat = ResponseFormat;
  public backgroundImageUrl: string = '';
  public videoUrl = signal('');

  // @ViewChild('dialog') dialog!: ViewContainerRef;

  constructor() {
    super();
    this.backgroundImageUrl = `url('assets/defaults/images/default_2_3.webp')`;
    effect(() => {
      this.generatedAsset = this.data()?.nodeData || null;
      if (this.generatedAsset) {
        this.videoUrl.set(this.generatedAsset?.result?.url);
      }
    });
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;

    this.dialogService.open(AssetGeneratedDetailsComponent, {
      header: 'Detalles de Generación',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      styleClass: 'draggable-dialog',
      closable: true,
      width: '650px',
      inputValues: {
        ...this.generatedAsset,
      },
      data: {
        ...this.generatedAsset,
      },
    });
  }

  public async refreshNode() {
    console.log(this.node().data);
    const generatedAsset = (await this.generatedAssetsService.findOne(this.node().data?.nodeData?.id || '')) as unknown as IGeneratedAsset;
    this.generatedAsset = generatedAsset;

    this.flowSignalNodeStateService.updateNodeData(this.node().id, { nodeData: this.generatedAsset });
  }
}
