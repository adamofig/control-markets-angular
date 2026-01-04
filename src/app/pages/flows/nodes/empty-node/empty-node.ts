import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFlowNode } from '../base-flow-node';
import { INodeConfig } from '../../models/flows.model';
import { ComponentDynamicNode } from 'ngx-vflow';

export interface CustomEmptyNode extends ComponentDynamicNode {
  data?: any;
  config: INodeConfig;
  nodeData: {
    name: string;
    description: string;
  };
}

@Component({
  selector: 'app-empty-node-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-node.html',
  styleUrl: './empty-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// COPY THIS NODE TO CREATE NEW NODES
export class EmptyNodeComponent extends BaseFlowNode<CustomEmptyNode> implements OnInit {
  public name: string = '';
  public description: string = '';

  override ngOnInit(): void {
    super.ngOnInit();
    this.name = this.nodeData()?.name || '';
    this.description = this.nodeData()?.description || '';
  }
}
