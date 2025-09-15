import { Component, OnInit } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { BaseFlowNode } from '../base-flow-node';
import { Button } from 'primeng/button';
import { IAssetNodeData } from '../../models/nodes.model';
import { Tag } from 'primeng/tag';
import { TagModule } from 'primeng/tag';

export interface CustomAssetsNode extends ComponentDynamicNode {
  nodeData: IAssetNodeData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [HandleComponent, Button, Tag, TagModule],
})
export class AssetsNodeComponent extends BaseFlowNode<CustomAssetsNode> {
  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    console.log('assets-node', this.node()?.data?.nodeData);
  }
}
