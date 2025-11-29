import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseNodeToolbarComponent } from '../node-toolbar/node-toolbar.component';
import { BaseFlowNode } from '../base-flow-node';
import { ComponentDynamicNode } from 'ngx-vflow';
import { ILeadNodeData } from '../../models/nodes.model';

export interface CustomLeadNode extends ComponentDynamicNode {
  nodeData: ILeadNodeData;
}

@Component({
  selector: 'app-lead-node',
  templateUrl: './lead-node.component.html',
  styleUrls: ['./lead-node.component.scss'],
  standalone: true,
  imports: [CommonModule, BaseNodeToolbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LeadNodeComponent extends BaseFlowNode<CustomLeadNode> {
  override handleToolbarEvents(event: string) {
    switch (event) {
      case 'delete':
        this.removeNode();
        break;
      case 'details':
        // this.openModal();
        break;
      case 'none':
        // Do nothing
        break;
    }
  }
}
