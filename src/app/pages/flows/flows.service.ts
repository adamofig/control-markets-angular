import { inject, Injectable } from '@angular/core';
import { ICreativeFlowBoard, IFlowExecutionState, ITaskExecutionState } from './models/flows.model';
import { FiltersConfig, IFilterQueryResponse, TOAST_ALERTS_TOKEN, EntityCommunicationService } from '@dataclouder/ngx-core';
import { APP_CONFIG } from '@dataclouder/ngx-core';
const server = 'primary';
// TODO add your own end points
const Endpoints = 'creative-flowboard';

@Injectable({
  providedIn: 'root',
})
export class FlowService extends EntityCommunicationService<ICreativeFlowBoard> {
    private appConfig = inject(APP_CONFIG);

  constructor() {
    super(Endpoints);
  }

  public async getFilteredFlows(filter: FiltersConfig) {
    return this.httpService.postHttp<IFilterQueryResponse<ICreativeFlowBoard>>({ service: `api/${Endpoints}/query`, data: filter });
  }

  public async getFlow(id: string): Promise<ICreativeFlowBoard> {
    return this.httpService.getHttp<ICreativeFlowBoard>({ host: this.appConfig.backendNodeUrl, service: `api/${Endpoints}/${id}` });
  }

  public async saveFlow(flow: ICreativeFlowBoard): Promise<ICreativeFlowBoard> {
    return this.httpService.postHttp<ICreativeFlowBoard>({ host: this.appConfig.backendNodeUrl, service: `api/${Endpoints}`, data: flow });
  }

  public async deleteFlow(id: string) {
    return this.httpService.deleteHttp<ICreativeFlowBoard>({ host: this.appConfig.backendNodeUrl, service: `${Endpoints}/${id}` });
  }

  public async runFlow(flowid: string): Promise<IFlowExecutionState> {
    return this.httpService.postHttp<IFlowExecutionState>({ host: this.appConfig.backendNodeUrl, service: `api/${Endpoints}/run/${flowid}`, data: {} });
  }

  public async runNode(flowId: string, nodeId: string): Promise<ITaskExecutionState> {
    // assummong node is a task
    return this.httpService.postHttp<ITaskExecutionState>({ host: this.appConfig.backendNodeUrl, service: `api/${Endpoints}/run-node`, data: { flowId, nodeId } });
  }

  public async runEndPoint(flowId: string, nodeId: string): Promise<ITaskExecutionState> {
    return this.httpService.postHttp<ITaskExecutionState>({ host: this.appConfig.backendNodeUrl, service: `api/${Endpoints}/run-endpoint`, data: { flowId, nodeId } });
  }
}
