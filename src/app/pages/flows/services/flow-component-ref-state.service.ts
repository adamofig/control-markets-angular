import { inject, Injectable, Signal } from '@angular/core';
import { CustomNodeComponent } from 'ngx-vflow';
import { DynamicNodeWithData } from './flow-diagram-state.service';
import { FlowSignalNodeStateService } from './flow-signal-node-state.service';

//  This must have all the edges and node so i can go thoew every one.
@Injectable({
  providedIn: 'root',
})
export class FlowComponentRefStateService {
  private flowSignalNodeStateService = inject(FlowSignalNodeStateService);
  // Cada nodo agrega su ID y su referencia al componente. injectando este servicio. asi. practicamente encuentro cualquier nodo sin usar la busqueda por medio del flow.nodes.

  public nodeComponentRefs: { [key: string]: CustomNodeComponent } = {};

  addNodeComponentRef(nodeId: string, componentRef: CustomNodeComponent) {
    this.nodeComponentRefs[nodeId] = componentRef;
  }

  removeNodeComponentRef(nodeId: string) {
    delete this.nodeComponentRefs[nodeId];
  }

  getNodeComponentRef(nodeId: string) {
    return this.nodeComponentRefs[nodeId];
  }

  updateData(nodeId: string, data: any) {
    this.nodeComponentRefs[nodeId].data.set(data);
    // Note that changes will temporal, if you want so save you need to update the signals.
    // this.flowSignalNodeStateService.updateNodeData(nodeId, data);
  }
}
