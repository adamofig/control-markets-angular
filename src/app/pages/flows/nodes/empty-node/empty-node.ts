import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseFlowNode } from '../base-flow-node';
import { CustomOutcomeNode } from '../outcome-node/outcome-node.component';

@Component({
  selector: 'app-empty-node-component',
  imports: [],
  templateUrl: './empty-node.html',
  styleUrl: './empty-node.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

// COPY THIS NODE TO CREATE NEW NODES
export class EmptyNodeComponent extends BaseFlowNode<CustomOutcomeNode> {}
