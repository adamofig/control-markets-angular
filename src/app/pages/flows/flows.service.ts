import { Injectable } from '@angular/core';
import { IAgentFlows, IFlowExecutionState, ITaskExecutionState } from './models/flows.model';
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
    return this.httpService.postHttp<IFilterQueryResponse<IAgentFlows>>({ service: `api/${Endpoints}/query`, data: filter });
  }

  public async getFlow(id: string): Promise<IAgentFlows> {
    return this.httpService.getHttp<IAgentFlows>({ service: `api/${Endpoints}/${id}` });
  }

  public async saveFlow(flow: IAgentFlows): Promise<IAgentFlows> {
    return this.httpService.postHttp<IAgentFlows>({ service: `api/${Endpoints}`, data: flow });
  }

  public async deleteFlow(id: string) {
    return this.httpService.deleteHttp<IAgentFlows>({ service: `${Endpoints}/${id}` });
  }

  public async runFlow(flowid: string): Promise<IFlowExecutionState> {
    return this.httpService.postHttp<IFlowExecutionState>({ service: `api/${Endpoints}/run/${flowid}`, data: {} });
  }

  public async runNode(flowId: string, nodeId: string): Promise<ITaskExecutionState> {
    // assummong node is a task
    return this.httpService.postHttp<ITaskExecutionState>({ service: `api/${Endpoints}/run-node`, data: { flowId, nodeId } });
  }

  public async runEndPoint(flowId: string, nodeId: string): Promise<ITaskExecutionState> {
    return this.httpService.postHttp<ITaskExecutionState>({ service: `api/${Endpoints}/run-endpoint`, data: { flowId, nodeId } });
  }
}
