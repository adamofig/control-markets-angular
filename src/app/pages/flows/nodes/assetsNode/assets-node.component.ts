import { Component, OnInit } from '@angular/core';
import { HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { IAssetNodeData } from 'src/app/pages/tasks/models/tasks-models';
import { inject } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { Button } from 'primeng/button';

export interface CustomAssetsNode extends ComponentDynamicNode {
  agentAsset: IAssetNodeData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [HandleComponent, Button],
})
export class AssetsNodeComponent extends BaseFlowNode<CustomAssetsNode> implements OnInit {
  constructor() {
    super();
  }

  override ngOnInit() {
    // You can add initialization logic here if needed in the future.
  }
}
