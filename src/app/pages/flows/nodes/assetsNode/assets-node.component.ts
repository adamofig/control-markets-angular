import { Component, OnInit } from '@angular/core';
import { CustomNodeComponent, HandleComponent } from 'ngx-vflow';
import { ComponentDynamicNode } from 'ngx-vflow';
import { IAssetNodeData } from 'src/app/pages/tasks/models/tasks-models';

export interface CustomAssetsNode extends ComponentDynamicNode {
  agentAsset: IAssetNodeData;
}

@Component({
  selector: 'app-assets-node',
  templateUrl: './assets-node.component.html',
  styleUrls: ['./assets-node.component.scss'],
  standalone: true,
  imports: [HandleComponent],
})
export class AssetsNodeComponent extends CustomNodeComponent<CustomAssetsNode> implements OnInit {
  constructor() {
    super();
  }

  override ngOnInit() {
    // You can add initialization logic here if needed in the future.
  }
}
