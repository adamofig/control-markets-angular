import { Injectable, signal } from '@angular/core';
import { IAgentFlows } from './models/flows.model';
import { DynamicNode, Edge } from 'ngx-vflow';

//  This must have all the edges and node so i can go thoew every one.
@Injectable({
  providedIn: 'root',
})
export class FlowStateService {
  private flow = signal<IAgentFlows | null>(null);

  public nodes = signal<DynamicNode[]>([]);

  public edges = signal<Edge[]>([]);

  public getFlow() {
    return this.flow();
  }

  public setFlow(flow: IAgentFlows) {
    this.flow.set(flow);
  }
}
