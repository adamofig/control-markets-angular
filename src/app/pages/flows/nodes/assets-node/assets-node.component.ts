import { Component, effect, inject } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { BaseFlowNode } from '../base-flow-node';
import { Button } from 'primeng/button';
import { IAssetNodeData } from '../../models/nodes.model';
import { Tag } from 'primeng/tag';
import { TagModule } from 'primeng/tag';
import { StatusJob } from '../../models/flows.model';
import { TOAST_ALERTS_TOKEN } from '@dataclouder/ngx-core';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { CommonModule } from '@angular/common';

export interface CustomAssetsNode extends ComponentDynamicNode {
  nodeData: IAssetNodeData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [HandleComponent, Button, Tag, TagModule, BaseNodeToolbarComponent, CommonModule],
})
export class AssetsNodeComponent extends BaseFlowNode<CustomAssetsNode> {
  private toastService = inject(TOAST_ALERTS_TOKEN);
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
    alert('No hay detalles');
  }
}
