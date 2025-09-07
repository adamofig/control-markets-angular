import { inject, Directive } from '@angular/core';
import { CustomNodeComponent } from 'ngx-vflow';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { ComponentDynamicNode } from 'ngx-vflow';

@Directive()
export abstract class BaseFlowNode<T extends ComponentDynamicNode> extends CustomNodeComponent<T> {
  public flowDiagramStateService = inject(FlowDiagramStateService);

  constructor() {
    super();
  }

  removeNode(): void {
    this.flowDiagramStateService.removeNode(this.node().id);
  }
}
