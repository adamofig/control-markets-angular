import { Injectable } from '@angular/core';
import { CustomNodeComponent } from 'ngx-vflow';

//  This must have all the edges and node so i can go thoew every one.
@Injectable({
  providedIn: 'root',
})
export class FlowComponentRefStateService {
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
  }
}
