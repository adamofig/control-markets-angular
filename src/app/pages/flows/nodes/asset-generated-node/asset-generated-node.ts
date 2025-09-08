import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, effect, inject } from '@angular/core';
import { ComponentDynamicNode, Vflow } from 'ngx-vflow';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { AssetGeneratedDetailsComponent } from './asset-generated-details/asset-generated-details';
import { ResponseFormat } from 'src/app/pages/jobs/models/jobs.model';
import { ButtonModule } from 'primeng/button';
import { FlowComponentRefStateService } from '../../services/flow-component-ref-state.service';
import { JsonPipe } from '@angular/common';
import { IGeneratedAsset, GeneratedAssetsService } from '@dataclouder/ngx-vertex';
import { BaseFlowNode } from '../base-flow-node';

export interface CustomAssetGeneratedNode extends ComponentDynamicNode {
  nodeData: IGeneratedAsset | null;
}

@Component({
  selector: 'app-outcome-node',
  imports: [Vflow, DialogModule, ButtonModule, JsonPipe],
  templateUrl: './asset-generated-node.html',
  styleUrl: './asset-generated-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AssetGeneratedNodeComponent extends BaseFlowNode<CustomAssetGeneratedNode> implements OnInit, OnDestroy {
  public dialogService = inject(DialogService);
  public flowComponentRefStateService = inject(FlowComponentRefStateService);
  public generatedAssetsService = inject(GeneratedAssetsService);

  public generatedAsset: IGeneratedAsset | null = null;
  public responseFormat = ResponseFormat;
  public backgroundImageUrl: string;
  public videoUrl: string = '';

  @ViewChild('dialog') dialog!: ViewContainerRef;

  override ngOnInit() {
    super.ngOnInit();
    this.flowComponentRefStateService.addNodeComponentRef(this.node().id, this);
  }

  ngOnDestroy() {
    this.flowComponentRefStateService.removeNodeComponentRef(this.node().id);
  }

  constructor() {
    super();
    this.backgroundImageUrl = `url('assets/defaults/images/default_2_3.webp')`;
    effect(() => {
      this.generatedAsset = this.data()?.nodeData || null;
      if (this.generatedAsset) {
        this.videoUrl = this.generatedAsset?.result.url;
        // this.backgroundImageUrl = imageUrl ? `url('${imageUrl}')` : `url('assets/defaults/images/default_2_3.webp')`;
        // console.log('generatedAsset', this.generatedAsset.result);
      }
    });
  }

  public isDialogVisible = false;

  openModal(): void {
    this.isDialogVisible = true;
    this.dialogService.open(AssetGeneratedDetailsComponent, {
      header: 'Outcome Node',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: true,
      closable: true,
      width: '650px',
      inputValues: {
        jobInput: this.generatedAsset,
      },
    });
  }

  public async refreshNode() {
    console.log(this.node().data);
    const generatedAsset = (await this.generatedAssetsService.findOne(this.node().data?.nodeData?.id || '')) as unknown as IGeneratedAsset;
    this.generatedAsset = generatedAsset;

    this.flowDiagramStateService.updateNodeData(this.node().id, { nodeData: this.generatedAsset });
  }
}
