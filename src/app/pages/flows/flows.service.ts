import { Injectable } from '@angular/core';
import { IAgentFlows } from './models/flows.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN, EntityCommunicationService } from '@dataclouder/ngx-core';

const server = 'primary';
// TODO add your own end points
const Endpoints = 'agent-flows';

@Injectable({
  providedIn: 'root',
})
export class FlowService extends EntityCommunicationService<IAgentFlows> {
  constructor() {
    super(Endpoints);
  }

  public async getFilteredFlows(filter: FiltersConfig) {
    return this.httpService.post<IFilterQueryResponse<IAgentFlows>>(`api/${Endpoints}/query`, filter, server);
  }

  public async getFlow(id: string): Promise<IAgentFlows> {
    return this.httpService.get<IAgentFlows>(`api/${Endpoints}/${id}`);
  }

  public async saveFlow(flow: IAgentFlows): Promise<IAgentFlows> {
    return this.httpService.post<IAgentFlows>(`api/${Endpoints}`, flow);
  }

  public async deleteFlow(id: string) {
    return this.httpService.delete(`${Endpoints}/${id}`);
  }

  public async runFlow(flowid: string) {
    return this.httpService.post<IAgentFlows>(`${Endpoints}/run/${flowid}`, {});
  }

  public async runNode(flowId: string, nodeId: string) {
    // assummong node is a task
    return this.httpService.post<IAgentFlows>(`${Endpoints}/run-node`, { flowId, nodeId });
  }
}
