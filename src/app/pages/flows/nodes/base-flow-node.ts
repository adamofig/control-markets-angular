import { inject, Directive, OnInit, OnDestroy } from '@angular/core';
import { CustomNodeComponent } from 'ngx-vflow';
import { FlowDiagramStateService } from '../services/flow-diagram-state.service';
import { ComponentDynamicNode } from 'ngx-vflow';
import { FlowComponentRefStateService } from '../services/flow-component-ref-state.service';

@Directive()
export abstract class BaseFlowNode<T extends ComponentDynamicNode> extends CustomNodeComponent<T> implements OnInit, OnDestroy {
  public flowDiagramStateService = inject(FlowDiagramStateService);
  public flowComponentRefStateService = inject(FlowComponentRefStateService);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.flowComponentRefStateService.addNodeComponentRef(this.node().id, this);
  }

  ngOnDestroy(): void {
    this.flowComponentRefStateService.removeNodeComponentRef(this.node().id);
  }

  removeNode(): void {
    this.flowDiagramStateService.removeNode(this.node().id);
  }
}
