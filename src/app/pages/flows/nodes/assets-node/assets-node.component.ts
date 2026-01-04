import { CommonModule } from '@angular/common';

import { Component, effect, inject } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';

import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { MessageContentDisplayer } from '@dataclouder/ngx-agent-cards';
import { Tag } from 'primeng/tag';
import { TagModule } from 'primeng/tag';

import { BaseFlowNode } from '../base-flow-node';
import { Button } from 'primeng/button';
import { IAssetNodeData } from '../../models/nodes.model';

import { INodeConfig, StatusJob } from '../../models/flows.model';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { DialogService } from 'primeng/dynamicdialog';
import { AssetDetailsComponent } from './asset-details/asset-details';

export interface CustomAssetsNode extends ComponentDynamicNode {
  data?: any;
  config: INodeConfig;
  nodeData: IAssetNodeData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [HandleComponent, Tag, TagModule, BaseNodeToolbarComponent, CommonModule],
})
export class AssetsNodeComponent extends BaseFlowNode<CustomAssetsNode> {
  private toastService = inject(TOAST_ALERTS_TOKEN);
  public dialogService = inject(DialogService);

  constructor() {
    super();
    effect(() => {
      const job = this.jobExecutionState();
      if (job) {
        console.log('jobExecutionState changed', job);
        if (job.status === StatusJob.FAILED) {
          this.toastService.error({ title: 'Error', subtitle: job.statusDescription || 'Error al ejecutar el job' });
        }
        //
      }
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    console.log('assets-node', this.node()?.data?.nodeData);
  }

  public openModal() {
    const nodeData = this.node()?.data?.nodeData;
    if (nodeData) {
      this.dialogService.open(AssetDetailsComponent, {
        header: 'Asset Details',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        draggable: true,
        styleClass: 'draggable-dialog',
        closable: true,
        width: '650px',
        data: {
          ...nodeData,
        },
      });
    }
  }
}
